# Contributing

Thank you for improving Archaeology Collections for Alt1.

## Suggested workflow

1. Fork the repository and create a focused branch.
2. Run `npm run build` and `npm run dev`.
3. Test collection selection, search, filters, counter edits, materials, summary totals, export, import, and reset.
4. Verify that `src/appconfig.json` remains valid JSON and uses relative URLs.
5. Keep the app dependency-free unless a dependency provides a clear user benefit.
6. Open a pull request describing the user-visible change and how it was tested.

## Data changes

When updating `src/data.js`:

- Preserve existing collection and artefact names where possible, because they form the local-storage keys.
- Keep quantities numeric and non-negative.
- Include a source URL for every collection.
- Check representative material, XP, chronote, and set calculations after editing.
- Run `npm run build` and commit the regenerated `dist` files.

## Style

- Keep all user-facing text in English.
- Maintain keyboard-accessible controls and visible labels.
- Keep the layout usable in narrow Alt1 windows.
- Avoid requesting Alt1 permissions unless a feature genuinely needs them.
