import { useEffect, useState } from 'react';
import { obtenerProductos } from '../api/productos';
import type { Producto } from '../types/producto';
import ProductCard from './ProductCard';
import './ProductGrid.css';

interface ProductGridProps {
  categoria?: string | null;
  onLimpiarFiltro?: () => void;
}

function ProductGrid({ categoria = null, onLimpiarFiltro }: ProductGridProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;

    obtenerProductos()
      .then((datos) => {
        if (vigente) {
          setProductos(datos);
        }
      })
      .catch((fallo: unknown) => {
        console.error(fallo);
        if (vigente) {
          setError(
            'No se pudieron cargar los productos. Verificá que el backend esté corriendo.'
          );
        }
      })
      .finally(() => {
        if (vigente) {
          setCargando(false);
        }
      });

    return () => {
      vigente = false;
    };
  }, []);

  if (cargando) {
    return <p className="estado">Cargando productos…</p>;
  }

  if (error) {
    return <p className="estado estado--error">{error}</p>;
  }

  if (productos.length === 0) {
    return <p className="estado">No hay productos disponibles.</p>;
  }

  const visibles = categoria
    ? productos.filter((producto) => producto.category === categoria)
    : productos;

  if (visibles.length === 0) {
    return (
      <div className="estado estado--vacio">
        <p>No hay productos en {categoria}.</p>
        {onLimpiarFiltro && (
          <button
            type="button"
            className="boton boton--secundario"
            onClick={onLimpiarFiltro}
          >
            Ver todos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="productos">
      {visibles.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

export default ProductGrid;
