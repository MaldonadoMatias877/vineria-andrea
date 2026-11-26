import { useContext } from 'react';
import { CarritoContext } from './contexto';
import type { CarritoContextValue } from './contexto';

export function useCarrito(): CarritoContextValue {
  const contexto = useContext(CarritoContext);

  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }

  return contexto;
}
