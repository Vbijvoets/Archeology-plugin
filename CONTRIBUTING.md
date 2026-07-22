# Contributing

Thank you for improving Archaeology Collections.

## Development workflow

1. Make changes in `src/`, `index.html` or `website.css`.
2. Run `npm run build`.
3. Confirm that the build succeeds without warnings or missing collection data.
4. Test affected tracker interactions in a browser when behavior changes.
5. Commit both the source changes and generated `dist/` files.

## Guidelines

- Keep the site usable on desktop and mobile screens.
- Preserve browser-stored progress when changing storage formats.
- Keep every artefact count non-negative and integral.
- Keep collection, material, XP, chronote and level data traceable to a reliable RuneScape source.
- Do not edit generated files in `dist/` without making the corresponding source change.
- Do not add accounts, analytics or external data collection without documenting the privacy impact.
