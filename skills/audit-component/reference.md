# Design System Guard reference

This file defines the audit rules and migration principles used by the plugin. It is design-system agnostic.

## Token source of truth

Approved token values live in a project-specific `tokens.json`, not in this skill file.

When auditing:

1. Prefer `tokens.json` at the repo root (or a path the user provides).
2. For the bundled demo, use `examples/tokens.json`.
3. Optionally, teams may add a detailed markdown reference under `references/` for guardrails and semantic mappings.

Do not invent tokens outside the configured token map.

## What to enforce

### Colors

Replace hardcoded hex values, Tailwind palette colors (e.g. `bg-slate-900`, `hover:bg-indigo-600`), and arbitrary Tailwind colors with semantic or palette tokens from the token map.

### Typography

Replace ad-hoc font sizes, weights, and line heights with typography tokens from the token map.

### Spacing

Replace arbitrary pixel spacing (`p-[13px]`, `gap-[7px]`) with spacing tokens from the token map.

### Radius

Replace arbitrary border-radius values with radius tokens from the token map.

### Shadows

Replace inline or arbitrary shadow values with shadow tokens from the token map.

## Approved components

Prefer design-system components over custom one-off UI. A raw HTML `<button>` with Tailwind classes is a violation when an approved `Button` exists. Update this list to match the target codebase, for example:

- `Button`
- `Card`
- `Badge`
- `Input`
- `Text`

## Migration principles

1. Replace hardcoded visual values with tokens from the configured token map.
2. Prefer component props over className when using design-system components.
3. Keep diffs small.
4. Do not invent tokens.
5. Leave unclear visual decisions for manual design review.
