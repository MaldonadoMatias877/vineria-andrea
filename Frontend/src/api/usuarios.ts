import type { DatosIngreso, NuevoUsuario, Usuario } from '../types/usuario';

const API_BASE = '/api';

async function leerError(respuesta: Response): Promise<string> {
  try {
    const cuerpo: unknown = await respuesta.json();

    if (typeof cuerpo === 'object' && cuerpo !== null && 'detail' in cuerpo) {
      const detalle = (cuerpo as { detail: unknown }).detail;

      if (typeof detalle === 'string') {
        return detalle;
      }

      if (Array.isArray(detalle)) {
        return detalle
          .map((item) => {
            if (typeof item === 'object' && item !== null && 'msg' in item) {
              return String((item as { msg: unknown }).msg);
            }
            return 'Dato inválido';
          })
          .join('. ');
      }
    }
  } catch {
    // La respuesta no traía JSON.
  }

  return 'Ocurrió un error inesperado';
}

export async function registrarUsuario(datos: NuevoUsuario): Promise<Usuario> {
  const respuesta = await fetch(`${API_BASE}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(await leerError(respuesta));
  }

  return (await respuesta.json()) as Usuario;
}

export async function ingresarUsuario(datos: DatosIngreso): Promise<Usuario> {
  const respuesta = await fetch(`${API_BASE}/ingresar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(await leerError(respuesta));
  }

  return (await respuesta.json()) as Usuario;
}
