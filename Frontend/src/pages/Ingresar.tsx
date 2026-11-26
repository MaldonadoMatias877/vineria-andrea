import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ingresarUsuario } from '../api/usuarios';
import type { Usuario } from '../types/usuario';
import './Auth.css';

interface IngresarProps {
  onIngresar: (usuario: Usuario) => void;
}

function Ingresar({ onIngresar }: IngresarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const veniaDeRegistro = Boolean(
    (location.state as { registrado?: boolean } | null)?.registrado
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const usuario = await ingresarUsuario({ email, password });
      onIngresar(usuario);
      navigate('/', { replace: true });
    } catch (fallo) {
      setError(
        fallo instanceof Error ? fallo.message : 'No se pudo ingresar'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="auth">
      <form className="auth__tarjeta" onSubmit={alEnviar}>
        <Link to="/" className="auth__volver">
          ← Volver al inicio
        </Link>
        <h1 className="auth__titulo">Ingresar</h1>
        <p className="auth__subtitulo">
          Accedé con el email y la contraseña de tu cuenta.
        </p>

        {veniaDeRegistro && (
          <p className="auth__exito" role="status">
            Registro exitoso. Ya podés ingresar.
          </p>
        )}

        <label className="campo">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className="campo">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="boton boton--primario auth__enviar"
          disabled={enviando}
        >
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p className="auth__pie">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </form>
    </main>
  );
}

export default Ingresar;
