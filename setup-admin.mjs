import { randomBytes } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const password = randomBytes(24).toString('base64url');
const email = 'fernandalmeida18@gmail.com';
try {
  await writeFile(new URL('./.env', import.meta.url), `ADMIN_USER=${email}\nADMIN_PASSWORD=${password}\n`, { flag: 'wx', mode: 0o600 });
  console.log(`E-mail: ${email}\nSenha: ${password}\nAs credenciais foram salvas no arquivo .env desta pasta.`);
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log('O arquivo .env já existe. Confira nele os campos ADMIN_USER e ADMIN_PASSWORD.');
}
