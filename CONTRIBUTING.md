# Contributing

ShelterShield follows the ticket sequence in `WORKPACKAGE.md`.

## Branching

- `main` is always deployable.
- `feature/ss-XX-*` branches implement one ticket at a time.
- Each ticket commit should use the exact conventional-commit message specified in `WORKPACKAGE.md`.

## Local Checks

Run these before opening a PR:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Later tickets add Python pipeline, data-validation, Playwright, axe, and Lighthouse gates.

## Data Integrity

- Do not fabricate data, metrics, findings, users, or results.
- Keep calculated outputs separate from proposed future capabilities.
- Never commit secrets.
- Preserve the Eviction Lab non-commercial flag and the HUD public-federal-data assumption wherever relevant.
