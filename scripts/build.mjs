import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src');
const destination = path.join(root, 'dist');
const files = ['index.html', 'styles.css', 'app.js', 'data.js', 'icon.png', 'appconfig.json'];

await fs.rm(destination, { recursive: true, force: true });
await fs.mkdir(destination, { recursive: true });
for (const file of files) await fs.copyFile(path.join(source, file), path.join(destination, file));
await fs.writeFile(path.join(destination, '.nojekyll'), '\n', 'utf8');

const config = JSON.parse(await fs.readFile(path.join(destination, 'appconfig.json'), 'utf8'));
const publicRoot = 'https://vbijvoets.github.io/Archeology-plugin/dist/';
if (config.appUrl !== `${publicRoot}index.html` || config.configUrl !== `${publicRoot}appconfig.json` || config.iconUrl !== `${publicRoot}icon.png`) {
  throw new Error('appconfig.json must use the absolute GitHub Pages production URLs');
}

const icon = await fs.readFile(path.join(destination, 'icon.png'));
if (!icon.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error('icon.png is not a valid PNG file');

const sandbox = { window: {} };
vm.runInNewContext(await fs.readFile(path.join(destination, 'data.js'), 'utf8'), sandbox);
const collections = sandbox.window.ARCHAEOLOGY_DATA?.collections;
if (!Array.isArray(collections) || collections.length === 0) throw new Error('No collection data found');

const appSource = await fs.readFile(path.join(destination, 'app.js'), 'utf8');
if (!appSource.includes('const defaults = emptyProgress();')) throw new Error('Fresh installs must start with zero artefact counts');
if (!appSource.includes("addEventListener('click',resetProgress)")) throw new Error('Reset handler validation failed');

console.log(`Built dist with ${collections.length} collections and ${collections.reduce((sum, item) => sum + item.artifacts.length, 0)} artefacts.`);
