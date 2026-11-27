import { useState } from 'react';
import { Link } from 'react-router-dom';
import CarritoResumen from '../components/CarritoResumen';
import ProductGrid from '../components/ProductGrid';
import type { Usuario } from '../types/usuario';
import './Home.css';

const CATEGORIAS = [
  'Cervezas',
  'Vinos',
  'Gaseosas',
  'Jugos',
  'Energizantes',
] as const;

type Categoria = (typeof CATEGORIAS)[number];

interface HomeProps {
  usuario: Usuario | null;
  onSalir: () => void;
}

function Home({ usuario, onSalir }: HomeProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  function seleccionarCategoria(categoria: Categoria) {
    setCategoriaActiva((actual) => (actual === categoria ? null : categoria));
    setMenuAbierto(false);
  }

  function claseBoton(categoria: Categoria) {
    return [
      'boton',
      'boton--secundario',
      'categorias__boton',
      categoriaActiva === categoria ? 'categorias__boton--activo' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  return (
    <main className="inicio">
      <div className="inicio__barra">
        <h1 className="inicio__kicker">Vinería Andrea</h1>

        {usuario ? (
          <div className="inicio__acciones">
            <span className="inicio__saludo">Hola, {usuario.nombre}</span>
            <button
              type="button"
              className="boton boton--secundario"
              onClick={onSalir}
            >
              Salir
            </button>
          </div>
        ) : (
          <div className="inicio__acciones">
            <Link to="/registro" className="boton boton--secundario">
              Registrarse
            </Link>
            <Link to="/ingresar" className="boton boton--primario">
              Ingresar
            </Link>
          </div>
        )}
      </div>

      <nav className="categorias" aria-label="Categorías de productos">
        <div className="categorias__desktop">
          {CATEGORIAS.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={claseBoton(categoria)}
              aria-pressed={categoriaActiva === categoria}
              onClick={() => seleccionarCategoria(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="categorias__movil">
          <div className="categorias__separador">
            <button
              type="button"
              className="categorias__toggle"
              aria-expanded={menuAbierto}
              aria-controls="menu-categorias"
              aria-label={menuAbierto ? 'Cerrar categorías' : 'Abrir categorías'}
              onClick={() => setMenuAbierto((abierto) => !abierto)}
            >
              <span aria-hidden="true">{menuAbierto ? '✕' : '☰'}</span>
            </button>
            <span className="categorias__etiqueta">
              {categoriaActiva ?? 'Categorías'}
            </span>
          </div>

          <ul
            id="menu-categorias"
            className="categorias__lista"
            hidden={!menuAbierto}
          >
            {CATEGORIAS.map((categoria) => (
              <li key={categoria}>
                <button
                  type="button"
                  className={claseBoton(categoria)}
                  aria-pressed={categoriaActiva === categoria}
                  onClick={() => seleccionarCategoria(categoria)}
                >
                  {categoria}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <CarritoResumen usuario={usuario} />
      <ProductGrid
        categoria={categoriaActiva}
        onLimpiarFiltro={() => setCategoriaActiva(null)}
      />
    </main>
  );
}

export default Home;
