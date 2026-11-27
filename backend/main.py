import hashlib
import os
import secrets

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from db_models import ProductoDB, UsuarioDB
from models import Producto, Usuario, UsuarioCrear, UsuarioIngreso

_ORIGENES_DEV = ["http://localhost:5173", "http://127.0.0.1:5173"]
_origenes_configurados = os.getenv("ALLOWED_ORIGINS")
ORIGENES_PERMITIDOS = (
    [origen.strip() for origen in _origenes_configurados.split(",") if origen.strip()]
    if _origenes_configurados
    else _ORIGENES_DEV
)

app = FastAPI(title="MI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGENES_PERMITIDOS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


def _a_publico(usuario: UsuarioDB) -> Usuario:
    return Usuario(
        id=usuario.id,
        nombre=usuario.nombre,
        email=usuario.email,
        telefono=usuario.telefono,
    )


def _a_producto(producto: ProductoDB) -> Producto:
    return Producto(
        id=producto.id,
        title=producto.title,
        price=float(producto.price),
        description=producto.description,
        category=producto.category,
        image=producto.image,
        rating={"rate": producto.rating_rate, "count": producto.rating_count},
    )


@app.get("/health")
def health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(select(1))
    return {"status": "ok"}


@app.get("/api/productos", response_model=list[Producto])
def listar_productos(db: Session = Depends(get_db)) -> list[Producto]:
    productos = db.scalars(select(ProductoDB).order_by(ProductoDB.id)).all()
    return [_a_producto(producto) for producto in productos]


@app.post("/api/usuarios", response_model=Usuario, status_code=201)
def registrar_usuario(
    datos: UsuarioCrear, db: Session = Depends(get_db)
) -> Usuario:
    email = datos.email.lower().strip()

    if db.scalar(select(UsuarioDB).where(UsuarioDB.email == email)) is not None:
        raise HTTPException(status_code=409, detail="Ese email ya está registrado")

    usuario = UsuarioDB(
        nombre=datos.nombre.strip(),
        email=email,
        telefono=datos.telefono.strip(),
        password_hash=_crear_hash(datos.password),
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return _a_publico(usuario)


@app.post("/api/ingresar", response_model=Usuario)
def ingresar(datos: UsuarioIngreso, db: Session = Depends(get_db)) -> Usuario:
    email = datos.email.lower().strip()
    usuario = db.scalar(select(UsuarioDB).where(UsuarioDB.email == email))

    if usuario is None or not _verificar_hash(
        datos.password, usuario.password_hash
    ):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    return _a_publico(usuario)
