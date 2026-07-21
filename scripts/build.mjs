import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src');
const destination = path.join(root, 'dist');
const files = ['index.html', 'styles.css', 'ads.css', 'app.js', 'data.js', 'icon.png', 'appconfig.json', 'adconfig.js', 'ad-loader.js'];

await fs.rm(destination, { recursive: true, force: true });
await fs.mkdir(destination, { recursive: true });
for (const file of files) await fs.copyFile(path.join(source, file), path.join(destination, file));
await fs.writeFile(path.join(destination, '.nojekyll'), '\n', 'utf8');

const config = JSON.parse(await fs.readFile(path.join(destination, 'appconfig.json'), 'utf8'));
if (config.appUrl !== './index.html' || config.configUrl !== './appconfig.json' || config.iconUrl !== './icon.png') {
  throw new Error('appconfig.json must use relative URLs so Alt1 can resolve the deployed app correctly');
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

const adConfigSource = await fs.readFile(path.join(destination, 'adconfig.js'), 'utf8');
const adLoaderSource = await fs.readFile(path.join(destination, 'ad-loader.js'), 'utf8');
if (!adConfigSource.includes('enabled: false')) throw new Error('Advertising must be disabled by default');
if (!adLoaderSource.includes('if (window.alt1 ||')) throw new Error('AdSense must never load inside Alt1');

console.log(`Built dist with ${collections.length} collections and ${collections.reduce((sum, item) => sum + item.artifacts.length, 0)} artefacts.`);
