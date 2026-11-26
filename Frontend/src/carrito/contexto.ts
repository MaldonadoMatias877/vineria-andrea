import { createContext } from 'react';
import type { Producto } from '../types/producto';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface CarritoContextValue {
  items: ItemCarrito[];
  cantidadTotal: number;
  total: number;
  agregar: (producto: Producto) => void;
  quitar: (id: number) => void;
  cambiarCantidad: (id: number, cantidad: number) => void;
  vaciar: () => void;
}

export const CarritoContext = createContext<CarritoContextValue | null>(null);
