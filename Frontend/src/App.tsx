import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import BotonVolverArriba from './components/BotonVolverArriba';
import BotonWhatsapp from './components/BotonWhatsapp';
import Home from './pages/Home';
import Ingresar from './pages/Ingresar';
import Registro from './pages/Registro';
import { borrarSesion, guardarSesion, leerSesion } from './sesion';
import type { Usuario } from './types/usuario';

function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(() => leerSesion());

  function iniciarSesion(datos: Usuario) {
    guardarSesion(datos);
    setUsuario(datos);
  }

  function cerrarSesion() {
    borrarSesion();
    setUsuario(null);
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home usuario={usuario} onSalir={cerrarSesion} />}
        />
        <Route
          path="/registro"
          element={usuario ? <Navigate to="/" replace /> : <Registro />}
        />
        <Route
          path="/ingresar"
          element={
            usuario ? (
              <Navigate to="/" replace />
            ) : (
              <Ingresar onIngresar={iniciarSesion} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BotonVolverArriba />
      <BotonWhatsapp />
    </>
  );
}

export default App;
