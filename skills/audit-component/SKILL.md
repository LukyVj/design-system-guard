---
name: audit-component
description: Audit a React component for design-system violations and suggest safe migrations to approved tokens and components.
---

# Design System Audit Skill

Use this skill when auditing React, TypeScript, JSX, TSX, or Tailwind UI code for design-system consistency.

The user is usually a frontend platform engineer trying to reduce design-system drift across teams.

## Source of truth

Use `reference.md` in this skill directory for audit rules and migration principles.

For approved token values, read the project's token map:

1. `tokens.json` at the repo root (or path the user specifies), when configured for their design system;
2. `examples/tokens.json` in this plugin repo for the bundled demo.

Optionally, teams may maintain a richer markdown reference under `references/` (see `references/stripe-hds-light.md` as a **demo example only** — not a built-in default).

Do not invent tokens, components, or naming conventions that are not present in the configured reference.

## Audit procedure

When auditing a component:

1. Identify hardcoded visual decisions.
2. Detect arbitrary Tailwind values.
3. Detect inline style props.
4. Detect custom UI that should likely use approved design-system components.
5. Map each issue to an approved token or component when possible.
6. Separate safe automatic edits from manual review items.
7. Prefer minimal diffs over broad rewrites.
8. Preserve props, behavior, accessibility attributes, and existing public API.

## Things to flag

Flag these issues:

- hardcoded hex colors like `#ff00aa`;
- Tailwind palette colors like `bg-slate-900`, `text-white`, or `hover:bg-indigo-600` when semantic tokens exist;
- Tailwind arbitrary colors like `bg-[#121212]`;
- Tailwind arbitrary spacing/sizing like `p-[13px]`, `gap-[7px]`, `w-[37px]`;
- inline style props like `style={{ color: "#fff" }}`;
- raw HTML `<button>` elements styled with className instead of an approved design-system `Button`;
- custom buttons, cards, badges, or inputs when an approved design-system component exists;
- inconsistent text sizes or spacing that should use tokens.

## Output format

Always return this format:

```md
## Summary

One or two sentences explaining the state of the component.

## Violations

- Violation: ...
  - Why it matters: ...
  - Suggested replacement: ...

## Suggested migration

Describe the smallest safe migration path.

## Safe edits

List edits Claude can make safely.

## Manual review needed

List decisions that require a human/design-system owner.

## Command to re-check

\`\`\`bash
node bin/ds-check.mjs <file-path>
\`\`\`

## Visual percentage

Compute this bar from violations found, not from vibes:

- Start at 100%.
- Subtract roughly 10–15 points per blocking violation (raw `<button>`, missing DS component, hardcoded hex).
- Subtract roughly 5–8 points per token drift issue (palette Tailwind colors, arbitrary values, inline styles).
- Floor at 0%. A component with a raw styled `<button>` should never score above ~40%.
- 100% means the component uses approved design-system components and tokens with no flagged drift.

Example: `[#######_______] 45%`

Always run `node bin/ds-check.mjs <file-path>` first and align the score with its output.

## Constraints

- Do not rewrite the component from scratch.
- Do not change business logic.
- Do not change public props unless explicitly asked.
- Do not invent missing tokens.
- If no approved mapping exists, say so clearly and mark it for manual review.
