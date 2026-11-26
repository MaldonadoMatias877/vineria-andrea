import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CarritoContext } from './contexto';
import type { ItemCarrito } from './contexto';
import type { Producto } from '../types/producto';

const CLAVE_CARRITO = 'vineria:carrito';

function esItemCarrito(valor: unknown): valor is ItemCarrito {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }

  const item = valor as Partial<ItemCarrito>;
  return (
    typeof item.producto === 'object' &&
    item.producto !== null &&
    typeof item.producto.id === 'number' &&
    typeof item.cantidad === 'number' &&
    Number.isInteger(item.cantidad) &&
    item.cantidad > 0
  );
}

function leerCarrito(): ItemCarrito[] {
  try {
    const crudo = localStorage.getItem(CLAVE_CARRITO);
    if (!crudo) {
      return [];
    }

    const datos: unknown = JSON.parse(crudo);
    if (!Array.isArray(datos)) {
      return [];
    }

    const vistos = new Set<number>();
    return datos.filter((item: unknown) => {
      if (!esItemCarrito(item) || vistos.has(item.producto.id)) {
        return false;
      }
      vistos.add(item.producto.id);
      return true;
    });
  } catch {
    return [];
  }
}

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>(leerCarrito);

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }, [items]);

  const agregar = useCallback((producto: Producto) => {
    setItems((actuales) => {
      const existente = actuales.find(
        (item) => item.producto.id === producto.id,
      );

      if (existente) {
        return actuales.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [...actuales, { producto, cantidad: 1 }];
    });
  }, []);

  const quitar = useCallback((id: number) => {
    setItems((actuales) => actuales.filter((item) => item.producto.id !== id));
  }, []);

  const cambiarCantidad = useCallback((id: number, cantidad: number) => {
    setItems((actuales) =>
      cantidad <= 0
        ? actuales.filter((item) => item.producto.id !== id)
        : actuales.map((item) =>
            item.producto.id === id ? { ...item, cantidad } : item,
          ),
    );
  }, []);

  const vaciar = useCallback(() => setItems([]), []);

  const valor = useMemo(
    () => ({
      items,
      cantidadTotal: items.reduce((suma, item) => suma + item.cantidad, 0),
      total: items.reduce(
        (suma, item) => suma + item.producto.price * item.cantidad,
        0,
      ),
      agregar,
      quitar,
      cambiarCantidad,
      vaciar,
    }),
    [items, agregar, quitar, cambiarCantidad, vaciar],
  );

  return (
    <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
  );
}
