import { Link } from 'react-router-dom';
import CarritoResumen from '../components/CarritoResumen';
import ProductGrid from '../components/ProductGrid';
import type { Usuario } from '../types/usuario';

interface HomeProps {
  usuario: Usuario | null;
  onSalir: () => void;
}

function Home({ usuario, onSalir }: HomeProps) {
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

      <header className="inicio__cabecera">
        <h2>Nuestra selección</h2>
        <p className="inicio__bajada">
          Una selección de nuestros productos, elegidos por el equipo de la
          bodega para acompañar cada momento.
        </p>
      </header>

      <CarritoResumen usuario={usuario} />
      <ProductGrid />
    </main>
  );
}

export default Home;
