import { useEffect, useState } from 'react';
import './BotonVolverArriba.css';

const UMBRAL_SCROLL = 300;

function BotonVolverArriba() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const actualizarVisibilidad = () => {
      setVisible(window.scrollY > UMBRAL_SCROLL);
    };

    actualizarVisibilidad();
    window.addEventListener('scroll', actualizarVisibilidad, { passive: true });

    return () => {
      window.removeEventListener('scroll', actualizarVisibilidad);
    };
  }, []);

  function volverArriba() {
    const reducirMovimiento = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reducirMovimiento ? 'auto' : 'smooth',
    });
  }

  return (
    <button
      type="button"
      className={`volver-arriba${visible ? ' volver-arriba--visible' : ''}`}
      onClick={volverArriba}
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

export default BotonVolverArriba;
