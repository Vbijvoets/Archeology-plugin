# Archaeology Collections

A browser-based RuneScape Archaeology collection tracker. It tracks damaged and restored artefacts, calculates restoration materials, XP and chronotes, counts complete sets, and provides a speed-ranked Best 25 overview.

## Website

The production website is published with GitHub Pages from the `master` branch:

https://w290pengs.com/

The site is static and requires no server, database, account or sign-in.

## Features

- All 79 Archaeology collections
- Damaged and restored artefact tracking
- Material totals per collection and across all collections
- Restoration XP and chronote summaries
- Best 25 collections ranked by required artefact levels
- Automatic browser storage
- JSON export and import
- Reset confirmation before progress is cleared
- Responsive desktop and mobile layout

## Local development

Node.js 24 or newer is recommended. The project has no package dependencies.

```bash
npm run dev
```

Create and validate the production files with:

```bash
npm run build
```

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Public website entry point |
| `website.css` | Website-specific layout |
| `src/` | Editable tracker assets and collection data |
| `dist/` | Generated production assets |
| `scripts/build.mjs` | Production build and validation |
| `.github/workflows/deploy-pages.yml` | GitHub Pages deployment |

Do not edit generated files in `dist/` directly. Change the matching source file in `src/` and run the build.

## Progress and privacy

Progress is stored only in the visitor's browser using `localStorage`. Existing tracker progress is migrated automatically to the website storage key. Export creates a portable JSON backup; import restores it on another browser or device.

The website does not require user accounts and does not send collection progress to a server.

## Advertising

Google AdSense support is present but disabled by default in `src/adconfig.js`. Only enable it after configuring a valid ad unit and any consent flow required for the intended audience. The publisher declaration is stored in `ads.txt`.

## Deployment

Every push to `master` runs the GitHub Pages workflow. A successful run builds the production assets, uploads the site and publishes it to the configured custom domain.

## License

MIT
