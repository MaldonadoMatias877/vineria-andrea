import type { Producto } from '../types/producto';

const API_BASE = '/api';

export async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await fetch(`${API_BASE}/productos`);

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al consultar los productos`);
  }

  return (await respuesta.json()) as Producto[];
}
