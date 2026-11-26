import type { ItemCarrito } from '../carrito/contexto';
import { useCarrito } from '../carrito/useCarrito';
import { formatearPrecio } from '../formato';
import type { Usuario } from '../types/usuario';
import { crearLinkWhatsapp } from '../whatsapp';
import './CarritoResumen.css';

interface CarritoResumenProps {
  usuario: Usuario | null;
}

function armarMensajePedido(
  items: ItemCarrito[],
  total: number,
  nombre?: string,
): string {
  const lineas = [
    'Hola, quisiera hacer este pedido:',
    ...items.map(
      ({ producto, cantidad }) =>
        `• ${cantidad} x ${producto.title} — ${formatearPrecio.format(
          producto.price * cantidad,
        )}`,
    ),
    `Total: ${formatearPrecio.format(total)}`,
  ];

  if (nombre) {
    lineas.push(`Nombre: ${nombre}`);
  }

  return lineas.join('\n');
}

function CarritoResumen({ usuario }: CarritoResumenProps) {
  const { items, cantidadTotal, total, cambiarCantidad, quitar, vaciar } =
    useCarrito();

  if (items.length === 0) {
    return (
      <section className="carrito" aria-label="Carrito de compras">
        <h3 className="carrito__titulo">Tu pedido</h3>
        <p className="carrito__vacio">
          Tu carrito está vacío. Agregá productos para armar tu pedido.
        </p>
      </section>
    );
  }

  const linkWhatsapp = crearLinkWhatsapp(
    armarMensajePedido(items, total, usuario?.nombre),
  );

  return (
    <section className="carrito" aria-label="Carrito de compras">
      <div className="carrito__cabecera">
        <h3 className="carrito__titulo">
          Tu pedido
          <span className="carrito__conteo">{cantidadTotal}</span>
        </h3>
        <button type="button" className="carrito__vaciar" onClick={vaciar}>
          Vaciar
        </button>
      </div>

      <ul className="carrito__lista">
        {items.map(({ producto, cantidad }) => (
          <li className="carrito__item" key={producto.id}>
            <div className="carrito__detalle">
              <span className="carrito__nombre">{producto.title}</span>
              <span className="carrito__precio">
                {formatearPrecio.format(producto.price * cantidad)}
              </span>
            </div>

            <div className="carrito__controles">
              <button
                type="button"
                className="carrito__cantidad"
                onClick={() => cambiarCantidad(producto.id, cantidad - 1)}
                aria-label={`Quitar una unidad de ${producto.title}`}
              >
                −
              </button>
              <span className="carrito__unidades">{cantidad}</span>
              <button
                type="button"
                className="carrito__cantidad"
                onClick={() => cambiarCantidad(producto.id, cantidad + 1)}
                aria-label={`Agregar una unidad de ${producto.title}`}
              >
                +
              </button>
              <button
                type="button"
                className="carrito__quitar"
                onClick={() => quitar(producto.id)}
                aria-label={`Quitar ${producto.title} del carrito`}
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="carrito__total">
        <span>Total</span>
        <strong>{formatearPrecio.format(total)}</strong>
      </div>

      {linkWhatsapp ? (
        <a
          className="boton boton--primario carrito__finalizar"
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          Finalizar pedido por WhatsApp
        </a>
      ) : (
        <p className="carrito__aviso">
          La compra por WhatsApp estará disponible cuando se configure el
          número de la tienda.
        </p>
      )}
    </section>
  );
}

export default CarritoResumen;
