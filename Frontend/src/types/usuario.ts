export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

export interface NuevoUsuario {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
}

export interface DatosIngreso {
  email: string;
  password: string;
}
