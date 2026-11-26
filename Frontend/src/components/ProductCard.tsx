import { useEffect, useRef, useState } from 'react';
import { useCarrito } from '../carrito/useCarrito';
import { formatearPrecio } from '../formato';
import type { Producto } from '../types/producto';
import { crearLinkWhatsapp } from '../whatsapp';
import './ProductCard.css';

interface ProductCardProps {
  producto: Producto;
}

function ProductCard({ producto }: ProductCardProps) {
  const { agregar } = useCarrito();
  const [agregado, setAgregado] = useState(false);
  const temporizador = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (temporizador.current !== null) {
        window.clearTimeout(temporizador.current);
      }
    },
    [],
  );

  function alAgregar() {
    agregar(producto);
    setAgregado(true);

    if (temporizador.current !== null) {
      window.clearTimeout(temporizador.current);
    }
    temporizador.current = window.setTimeout(() => setAgregado(false), 1400);
  }

  const linkConsulta = crearLinkWhatsapp(
    `Hola, quisiera consultar por: ${producto.title} (${formatearPrecio.format(
      producto.price,
    )}).`,
  );

  return (
    <article className="producto">
      <div className="producto__imagen">
        <img
          src={producto.image}
          alt={producto.title}
          loading="lazy"
          width="200"
          height="200"
        />
      </div>

      <div className="producto__cuerpo">
        <span className="producto__categoria">{producto.category}</span>
        <h3 className="producto__titulo">{producto.title}</h3>
        <p className="producto__descripcion">{producto.description}</p>
      </div>

      <footer className="producto__pie">
        <div className="producto__detalle">
          <strong className="producto__precio">
            {formatearPrecio.format(producto.price)}
          </strong>
          <span className="producto__valoracion">
            <span aria-hidden="true">★</span> {producto.rating.rate.toFixed(1)}
            <span className="producto__valoracion-conteo">
              ({producto.rating.count})
            </span>
          </span>
        </div>

        <div className="producto__acciones">
          <button
            type="button"
            className="boton boton--primario producto__agregar"
            onClick={alAgregar}
            aria-label={`Agregar ${producto.title} al carrito`}
          >
            {agregado ? 'Agregado ✓' : 'Agregar'}
          </button>
          {linkConsulta && (
            <a
              className="boton boton--secundario producto__consultar"
              href={linkConsulta}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar por ${producto.title} en WhatsApp`}
            >
              Consultar
            </a>
          )}
        </div>
      </footer>
    </article>
  );
}

export default ProductCard;
