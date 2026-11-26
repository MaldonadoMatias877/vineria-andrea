import type { Usuario } from './types/usuario';

const CLAVE_SESION = 'vineria:usuario';

export function leerSesion(): Usuario | null {
  try {
    const crudo = localStorage.getItem(CLAVE_SESION);
    if (!crudo) {
      return null;
    }
    return JSON.parse(crudo) as Usuario;
  } catch {
    return null;
  }
}

export function guardarSesion(usuario: Usuario): void {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
}

export function borrarSesion(): void {
  localStorage.removeItem(CLAVE_SESION);
}
