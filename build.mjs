import {cp,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';

const root=path.dirname(fileURLToPath(import.meta.url));
const output=path.join(root,'dist');
await mkdir(output,{recursive:true});
for(const file of ['index.html','style.css','script.js','portfolio-content.js','portfolio-fields.js','admin.html','admin.css','admin.js']){
  await copyFile(path.join(root,file),path.join(output,file));
}
await cp(path.join(root,'assets'),path.join(output,'assets'),{recursive:true});
await build({
  stdin: { contents: "export { upload } from '@vercel/blob/client';", resolveDir: root },
  bundle: true,
  format: 'esm',
  platform: 'browser',
  minify: true,
  outfile: path.join(output, 'admin-upload.js'),
});
console.log('Static site ready in dist/');
