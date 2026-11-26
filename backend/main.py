import hashlib
import json
import secrets
import threading
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import Producto, Usuario, UsuarioCrear, UsuarioIngreso

SEED_PATH = Path(__file__).parent / "seed.json"

app = FastAPI(title="MI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
    )

# Usuarios en memoria: se pierden al reiniciar el backend.
_usuarios: list[dict] = []
_siguiente_id = 1
_usuarios_lock = threading.Lock()

_ITERACIONES_HASH = 100_000


def _crear_hash(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, _ITERACIONES_HASH
    )
    return f"{salt.hex()}${digest.hex()}"


def _verificar_hash(password: str, almacenado: str) -> bool:
    salt_hex, digest_hex = almacenado.split("$", 1)
    calculado = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt_hex),
        _ITERACIONES_HASH,
    )
    return secrets.compare_digest(calculado, bytes.fromhex(digest_hex))


def _a_publico(usuario: dict) -> Usuario:
    return Usuario(
        id=usuario["id"],
        nombre=usuario["nombre"],
        email=usuario["email"],
        telefono=usuario["telefono"],
    )


@app.get("/api/productos", response_model=list[Producto])
def listar_productos():
    if not SEED_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail="No existe seed.json. Ejecuta: python backend/seed.py"
        )

    return json.loads(SEED_PATH.read_text(encoding="utf-8"))


@app.post("/api/usuarios", response_model=Usuario, status_code=201)
def registrar_usuario(datos: UsuarioCrear):
    global _siguiente_id

    email = datos.email.lower().strip()

    with _usuarios_lock:
        if any(usuario["email"] == email for usuario in _usuarios):
            raise HTTPException(
                status_code=409,
                detail="Ese email ya está registrado"
            )

        usuario = {
            "id": _siguiente_id,
            "nombre": datos.nombre.strip(),
            "email": email,
            "telefono": datos.telefono.strip(),
            "password_hash": _crear_hash(datos.password),
        }
        _usuarios.append(usuario)
        _siguiente_id += 1

    return _a_publico(usuario)


@app.post("/api/ingresar", response_model=Usuario)
def ingresar(datos: UsuarioIngreso):
    email = datos.email.lower().strip()

    with _usuarios_lock:
        usuario = next(
            (u for u in _usuarios if u["email"] == email),
            None,
        )

    if usuario is None or not _verificar_hash(
        datos.password, usuario["password_hash"]
    ):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    return _a_publico(usuario)
