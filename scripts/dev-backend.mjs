import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Permite usar `pnpm dev` en Windows, Linux y macOS sin depender de que el
// entorno virtual esté activado en la terminal.
const raiz = dirname(dirname(fileURLToPath(import.meta.url)));

const rutaPython = process.platform === 'win32'
  ? join(raiz, 'backend', '.venv', 'Scripts', 'python.exe')
  : join(raiz, 'backend', '.venv', 'bin', 'python');

if (!existsSync(rutaPython)) {
  console.error(`No se encontró el intérprete del entorno virtual: ${rutaPython}`);
  console.error('Windows: py -m venv backend\\.venv');
  console.error('Linux/macOS: python3 -m venv backend/.venv');
  console.error('Luego: <venv> -m pip install -r backend/requirements.txt');
  process.exit(1);
}

const hijo = spawn(
  rutaPython,
  [
    '-m', 'uvicorn', 'main:app',
    '--app-dir', 'backend',
    '--reload', '--reload-dir', 'backend',
  ],
  {
    cwd: raiz,
    stdio: 'inherit',
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
  },
);

let deteniendo = false;
for (const senal of ['SIGINT', 'SIGTERM']) {
  process.on(senal, () => {
    if (deteniendo) return;
    deteniendo = true;
    hijo.kill(senal);
  });
}

hijo.on('error', (error) => {
  console.error('No se pudo iniciar el backend:', error);
  process.exit(1);
});

hijo.on('exit', (codigo, senal) => {
  process.exit(deteniendo || senal ? 0 : (codigo ?? 0));
});
