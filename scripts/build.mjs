import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src');
const destination = path.join(root, 'dist');
const files = ['index.html', 'styles.css', 'app.js', 'data.js', 'icon.svg', 'appconfig.json'];

await fs.rm(destination, { recursive: true, force: true });
await fs.mkdir(destination, { recursive: true });
for (const file of files) await fs.copyFile(path.join(source, file), path.join(destination, file));
await fs.writeFile(path.join(destination, '.nojekyll'), '\n', 'utf8');

const config = JSON.parse(await fs.readFile(path.join(destination, 'appconfig.json'), 'utf8'));
if (config.appUrl !== './index.html' || config.configUrl !== './appconfig.json') {
  throw new Error('appconfig.json must use relative production URLs');
}

const sandbox = { window: {} };
vm.runInNewContext(await fs.readFile(path.join(destination, 'data.js'), 'utf8'), sandbox);
const collections = sandbox.window.ARCHAEOLOGY_DATA?.collections;
if (!Array.isArray(collections) || collections.length === 0) throw new Error('No collection data found');

console.log(`Built dist with ${collections.length} collections and ${collections.reduce((sum, item) => sum + item.artifacts.length, 0)} artefacts.`);
