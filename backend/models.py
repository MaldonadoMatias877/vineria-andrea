from pydantic import BaseModel, EmailStr, Field


class Valoracion(BaseModel):
    rate: float
    count: int


class Producto(BaseModel):
    id: int
    title: str
    price: float
    description: str
    category: str
    image: str
    rating: Valoracion


class UsuarioCrear(BaseModel):
    nombre: str = Field(min_length=1, max_length=80)
    email: EmailStr
    telefono: str = Field(min_length=6, max_length=30)
    password: str = Field(min_length=8, max_length=128)


class UsuarioIngreso(BaseModel):
    email: EmailStr
    password: str


class Usuario(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    telefono: str
