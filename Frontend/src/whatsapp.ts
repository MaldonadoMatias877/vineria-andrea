// El número se lee de VITE_WHATSAPP_NUMERO. Mientras no esté configurado,
// crearLinkWhatsapp devuelve null y los componentes ocultan sus botones.
const numeroConfigurado = (import.meta.env.VITE_WHATSAPP_NUMERO ?? '').replace(
  /[^\d]/g,
  '',
);

const LIMITE_MENSAJE = 1000;

export function crearLinkWhatsapp(mensaje: string): string | null {
  // E.164: entre 8 y 15 dígitos, sin el signo "+".
  if (numeroConfigurado.length < 8 || numeroConfigurado.length > 15) {
    return null;
  }

  const texto = mensaje.slice(0, LIMITE_MENSAJE);
  return `https://wa.me/${numeroConfigurado}?text=${encodeURIComponent(texto)}`;
}
