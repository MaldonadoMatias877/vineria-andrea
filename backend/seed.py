from sqlalchemy.dialects.postgresql import insert

from database import SessionLocal
from db_models import ProductoDB

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
    session = SessionLocal()
    try:
        for producto in PRODUCTOS:
            sentencia = insert(ProductoDB).values(
                id=producto["id"],
                title=producto["title"],
                price=producto["price"],
                description=producto["description"],
                category=producto["category"],
                image=producto["image"],
                rating_rate=producto["rating"]["rate"],
                rating_count=producto["rating"]["count"],
            )
            sentencia = sentencia.on_conflict_do_nothing(index_elements=["id"])
            session.execute(sentencia)

        session.commit()
        print(f"{len(PRODUCTOS)} productos verificados en PostgreSQL")
    finally:
        session.close()


if __name__ == "__main__":
    main()
