import json
from pathlib import Path

SEED_PATH = Path(__file__).parent / "seed.json"

PRODUCTOS = [
    {
        "id": 1,
        "title": "Vino Toro Tinto",
        "price": 2000,
        "description": "Vino toro tinto tetra Pack 1L",
        "category": "Vinos",
        "image": "/imagenes/vino-toro.webp",
        "rating": {"rate": 3.6, "count": 145},
    },
    {
        "id": 2,
        "title": "Vino Latitud 33",
        "price": 1500,
        "description": "Vino Latitud 33, ideal para acompañar carnes rojas y pastas.",
        "category": "Vinos",
        "image": "/imagenes/vino-latitud-33.webp",
        "rating": {"rate": 4.2, "count": 98},
    },
    {
        "id": 3,
        "title": "Viñas de Balbo",
        "price": 2500,
        "description": "Vino Viñas de Balbo, de cuerpo equilibrado y final persistente.",
        "category": "Vinos",
        "image": "/imagenes/vinas-de-balbo.webp",
        "rating": {"rate": 4.0, "count": 76},
    },
]


def main() -> None:
    SEED_PATH.write_text(
        json.dumps(PRODUCTOS, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"{len(PRODUCTOS)} productos guardados en {SEED_PATH}")


if __name__ == "__main__":
    main()
