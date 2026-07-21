# Archaeology Collections for Alt1

A lightweight, dependency-free Alt1 Toolkit app for tracking RuneScape Archaeology collections. It calculates required restoration materials, restoration XP, chronotes, complete sets, and outfit-adjusted XP from the collection data originally modelled in an Excel workbook.

## Features

- 73 collection sheets and 485 artefact entries
- Damaged and restored counters for every artefact
- Required-material totals based on damaged artefacts
- Restoration XP and +6% outfit XP
- Artefact chronotes and collection set bonuses
- Collector and museum filters
- Collection and artefact search
- Automatic local saving
- JSON progress import and export
- Reset all counters to zero
- No screen, game-state, or overlay permissions
- Optional unobtrusive advertisement slot below the main content
- Familiar `src` and `dist` structure, modelled after established Alt1 repositories
- Dependency-free npm build and local development scripts

## Website and Alt1 installation

Website: `https://archeology-collections.fun/`

Install the tracker in Alt1 with:

```text
alt1://addapp/https://archeology-collections.fun/dist/appconfig.json
```

If the protocol link does not open, browse to the deployed `index.html` inside Alt1's built-in browser and click **Add app** in the top-right corner.

## Fork and publish in a few minutes

1. Fork or upload this folder as a GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Push to `master`, or manually run the **Deploy static site to GitHub Pages** workflow.
5. Wait for the deployment to finish under the **Actions** tab.
6. Set the Pages custom domain to `archeology-collections.fun` and configure the domain's DNS records.
7. Open `https://archeology-collections.fun/` and `https://archeology-collections.fun/dist/` to verify the website and Alt1 app.
8. Share the Alt1 installation URL shown above.

The included workflow runs the dependency-free build and publishes the repository as a static site. No secrets or package installation are required.

## Local development

Node.js 24 or newer is recommended. No `npm install` step is needed because the project has no package dependencies.

```text
npm run build
npm run dev
```

Then open:

```text
http://127.0.0.1:8765/
```

`npm run build` validates the manifest, collection data, website metadata and publisher files, then recreates `dist`. `npm run dev` serves the complete website at the local URL above. The standalone Alt1 view is available at `/dist/`.

## Optional advertising

The advertisement area is disabled and completely hidden by default. It supports Google AdSense only when the GitHub Pages site is opened in a normal browser. The loader exits before contacting Google whenever `window.alt1` is present, because Alt1's Windows Chromium WebView is not one of Google's publicly supported WebView integrations.

After Google approves the website, create a responsive display unit and edit `src/adconfig.js`:

```js
window.ARCHAEOLOGY_AD_CONFIG = Object.freeze({
  enabled: true,
  client: 'ca-pub-YOUR-PUBLISHER-ID',
  slot: 'YOUR-NUMERIC-AD-SLOT-ID'
});
```

Use the exact publisher and slot IDs supplied by Google. Run `npm run build` and deploy the generated `dist` directory. Revenue is credited only to the configured AdSense account. The slot is labelled `Advertisement`, never opens a popup or overlay, and stays hidden when opened inside Alt1, when unconfigured, when blocked, or when Google returns no ad.

Before enabling AdSense, add the privacy information and Google-certified consent mechanism required for visitors in the EEA, UK, and Switzerland.

## Project structure

| File | Purpose |
| --- | --- |
| `src/` | Editable HTML, CSS, JavaScript, data, icon, and Alt1 manifest |
| `dist/` | Production-ready files served to Alt1 and GitHub Pages |
| `scripts/build.mjs` | Dependency-free production build and validation |
| `scripts/serve.mjs` | Dependency-free local static server |
| `package.json` | Build and development commands |
| `.github/workflows/deploy-pages.yml` | GitHub Pages deployment |

## Customising the app

The app is intentionally framework-free. Most changes can be made directly:

- Change the app title and description in `src/index.html` and `src/appconfig.json`.
- Adjust colours and layout in `src/styles.css`.
- Update collection data in `src/data.js`.
- Change calculation or persistence behaviour in `src/app.js`.
- Run `npm run build` after every source change; do not edit generated `dist` files directly.

Each collection in `src/data.js` contains a name, group, set bonus, source URL, and artefacts. Each artefact contains its starting damaged/restored counts, chronotes, XP, and material quantities.

When changing the data structure, keep collection and artefact names stable if you want existing browser progress to remain associated with the same entries.

## Data and calculations

The calculation model follows the supplied workbook:

- Required materials = damaged count × material requirement.
- Restoration XP = damaged count × artefact restoration XP.
- Artefact chronotes = restored count × artefact chronotes.
- Complete sets = the smallest combined damaged + restored count among all artefacts in a collection.
- Set chronotes = complete sets × collection set bonus.
- Total chronotes = artefact chronotes + set chronotes.
- Outfit XP = restoration XP × 1.06.

Progress is stored in the browser's `localStorage` under `archaeology-collections-alt1-v1`. Exporting progress creates a portable JSON backup. Reset sets every damaged and restored counter to `0`.

## Troubleshooting Alt1 installation

- Make sure the GitHub Pages URL is publicly reachable over HTTPS.
- Open the app in Alt1's built-in browser and use its **Add app** button.
- If `alt1://` links do not work, go to **Settings → Other** and toggle **Enable Alt1 links in browser** off and on.
- Alt1 may silently fail when one Installed Apps folder contains too many entries. Create a subfolder, move several apps into it, and try again.
- The app requests no privileged Alt1 permissions.

## Privacy

Progress stays in the browser unless the user explicitly exports it. Advertising is disabled by default, so the unconfigured app makes no advertising or analytics requests. When configured, AdSense loads only on the normal website and never inside Alt1. Google may process visitor data on the website; document this and implement the required consent before deployment.

## Contributing

Bug reports and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the suggested workflow.

## Acknowledgements

The repository layout and straightforward `src` → `dist` publishing model were inspired by [NadyaNayme/BetterBuffsBar](https://github.com/NadyaNayme/BetterBuffsBar), an established open-source Alt1 app. This project does not copy BetterBuffsBar's application code or assets.

## Licence

Released under the [MIT License](LICENSE).
