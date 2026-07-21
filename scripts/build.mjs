import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src');
const destination = path.join(root, 'dist');
const files = ['index.html', 'styles.css', 'ads.css', 'planner.css', 'app.js', 'data.js', 'levels.js', 'collections-2026.js', 'icon.png', 'appconfig.json', 'adconfig.js', 'ad-loader.js'];

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
vm.runInNewContext(await fs.readFile(path.join(destination, 'levels.js'), 'utf8'), sandbox);
vm.runInNewContext(await fs.readFile(path.join(destination, 'collections-2026.js'), 'utf8'), sandbox);
const collections = sandbox.window.ARCHAEOLOGY_DATA?.collections;
if (!Array.isArray(collections) || collections.length === 0) throw new Error('No collection data found');
const expectedCollections = ['Museum - Training Weapons', 'Guthixian I', 'Museum - Guthixian I', 'Guthixian II', 'Museum - Guthixian II', 'Dragonkin II'];
const missingCollections = expectedCollections.filter(name => !collections.some(collection => collection.name === name));
if (collections.length !== 79 || missingCollections.length) throw new Error(`Expected all 79 collections; missing: ${missingCollections.join(', ') || 'none'}`);
const levels = sandbox.window.ARCHAEOLOGY_LEVELS;
const missingLevels = [...new Set(collections.flatMap(collection => collection.artifacts.map(artifact => artifact.name)))].filter(name => !Number.isInteger(levels?.[name]));
if (missingLevels.length) throw new Error(`Missing Archaeology levels for: ${missingLevels.join(', ')}`);

const appSource = await fs.readFile(path.join(destination, 'app.js'), 'utf8');
if (!appSource.includes('const defaults = emptyProgress();')) throw new Error('Fresh installs must start with zero artefact counts');
if (!appSource.includes("addEventListener('click',resetProgress)")) throw new Error('Reset handler validation failed');
if (!appSource.includes("window.confirm('Reset all artefact counts to 0? This cannot be undone.')")) throw new Error('Reset must warn before clearing progress');

const adConfigSource = await fs.readFile(path.join(destination, 'adconfig.js'), 'utf8');
const adLoaderSource = await fs.readFile(path.join(destination, 'ad-loader.js'), 'utf8');
if (!adConfigSource.includes('enabled: false')) throw new Error('Advertising must be disabled by default');
if (!adLoaderSource.includes('if (window.alt1 ||')) throw new Error('AdSense must never load inside Alt1');

const websiteSource = await fs.readFile(path.join(root, 'index.html'), 'utf8');
const adsText = await fs.readFile(path.join(root, 'ads.txt'), 'utf8');
const robotsText = await fs.readFile(path.join(root, 'robots.txt'), 'utf8');
const sitemapText = await fs.readFile(path.join(root, 'sitemap.xml'), 'utf8');
if (!websiteSource.includes('ca-pub-3112681455071923')) throw new Error('The website must include the AdSense verification code');
if (!websiteSource.includes('https://archeology-collections.fun/')) throw new Error('The website must use the custom domain');
if (!appSource.includes('https://archeology-collections.fun/dist/appconfig.json')) throw new Error('The Alt1 app must install from the custom domain');
if (!websiteSource.includes('dist/app.js')) throw new Error('The website must include the collection tracker');
if (!appSource.includes("addEventListener('input',event")) throw new Error('Artefact counts must save on every input');
if (!appSource.includes('.sort(compareCollections)') || !appSource.includes("replace(/^Museum - /i,''") || !appSource.includes('function collectionFamily(c)')) throw new Error('Similar collection names must be grouped and ordered');
if (!websiteSource.includes('data-view="planner"') || websiteSource.includes('data-view="planner120"') || !appSource.includes('function collectionSpeedValue(c)')) throw new Error('The fastest Best 25 collection planner is missing or the removed 99–120 tab returned');
if (!adsText.includes('pub-3112681455071923')) throw new Error('ads.txt must contain the AdSense publisher ID');
if (!robotsText.includes('https://archeology-collections.fun/sitemap.xml')) throw new Error('robots.txt must reference the sitemap');
if (!sitemapText.includes('https://archeology-collections.fun/')) throw new Error('sitemap.xml must use the custom domain');

console.log(`Built dist with ${collections.length} collections and ${collections.reduce((sum, item) => sum + item.artifacts.length, 0)} artefacts.`);
