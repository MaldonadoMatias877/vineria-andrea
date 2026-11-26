import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../api/usuarios';
import './Auth.css';

function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      await registrarUsuario({ nombre, email, telefono, password });
      navigate('/ingresar', { state: { registrado: true } });
    } catch (fallo) {
      setError(
        fallo instanceof Error
          ? fallo.message
          : 'No se pudo completar el registro'
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
        <h1 className="auth__titulo">Crear cuenta</h1>
        <p className="auth__subtitulo">
          Registrate para ingresar a la tienda.
        </p>

        <label className="campo">
          <span>Nombre</span>
          <input
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            required
            minLength={1}
            maxLength={80}
            autoComplete="name"
          />
        </label>

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
          <span>Teléfono</span>
          <input
            type="tel"
            value={telefono}
            onChange={(evento) => setTelefono(evento.target.value)}
            required
            minLength={6}
            maxLength={30}
            autoComplete="tel"
          />
        </label>

        <label className="campo">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            required
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
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
          {enviando ? 'Registrando…' : 'Registrarse'}
        </button>

        <p className="auth__pie">
          ¿Ya tenés cuenta? <Link to="/ingresar">Ingresá</Link>
        </p>
      </form>
    </main>
  );
}

export default Registro;
