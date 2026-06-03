import { access, copyFile } from 'node:fs/promises';

const SRC = 'dist/index.html';
const DEST = 'dist/404.html';

try {
  await access(SRC);
  await copyFile(SRC, DEST);
  console.log(`[copy-404] ${SRC} -> ${DEST}`);
} catch (err) {
  console.error(`[copy-404] skipped: ${err.message}`);
  process.exit(0); // non-fatal: dev environment without a build is fine
}
