# Design System Guard

A Claude Code plugin for frontend platform engineers responsible for design-system adoption across multiple React teams.

## Who this is for

This plugin is for a frontend platform engineer at a B2B SaaS company where many product teams ship React UI.

The platform engineer owns design-system consistency but keeps seeing the same issues in PRs:

- hardcoded colors;
- arbitrary Tailwind values;
- inline styles;
- custom one-off buttons/cards instead of approved components;
- inconsistent spacing and typography.

## Problem

Design-system rules often live in docs, Slack messages, and repeated PR comments.

Claude Code can help during a migration, but without packaged team-specific context, every session starts from scratch.

Design System Guard packages that workflow into a reusable Claude Code plugin.

## Prerequisites

- [Claude Code](https://code.claude.com/) CLI installed
- Node.js 22+ (for `bin/ds-check.mjs` only — no `npm install` required)

## What the plugin does

The plugin includes:

- a skill: `/design-system-guard:audit-component`;
- an agent: `design-system-migrator`;
- a hook: `PostToolUse` after `Write`/`Edit`;
- a dependency-free checker: `bin/ds-check.mjs`;
- example bad/good React components.

It helps Claude Code:

1. audit a component for design-system drift;
2. suggest safe migrations to approved tokens/components;
3. apply minimal diffs when asked;
4. warn after edits if new violations appear.

## Install locally

Clone the repo:

```bash
git clone https://github.com/lucasbonomi/design-system-guard.git
cd design-system-guard
```

Validate the plugin:

```bash
claude plugin validate . --strict
```

Start Claude Code with the plugin loaded:

```bash
claude --plugin-dir .
```

If you edit plugin components while Claude Code is running, run:

```txt
/reload-plugins
```

or restart Claude Code.

## Try it in under 5 minutes

First, run the local checker manually:

```bash
node bin/ds-check.mjs examples/bad/Button.tsx
```

Expected output should include warnings for a raw HTML `<button>`, Tailwind palette colors (e.g. `bg-slate-900`), and missing design-system component usage.

### Bootstrap a token map from an existing codebase

If you do not yet have a `tokens.json`, scan a codebase to harvest the values already in use:

```bash
# print to stdout
node bin/ds-check.mjs --scan-to-tokens src

# write a file
node bin/ds-check.mjs --scan-to-tokens src --out tokens.json
```

The scanner walks `.tsx/.jsx/.ts/.js` files (skipping `node_modules`, `dist`, `build`, etc.) and collects colors, spacing, radius, font sizes, and shadows, each ranked by usage frequency. Frequent values are likely real tokens; rare ones are often the drift this plugin exists to catch. Output is a starting point to curate, not a finished design system.

Then open Claude Code with the plugin:

```bash
claude --plugin-dir .
```

Inside Claude Code, run:

```txt
/design-system-guard:audit-component examples/bad/Button.tsx
```

Then ask:

```txt
Use the design-system-migrator agent to migrate examples/bad/Button.tsx to the approved design-system tokens. Keep the diff minimal.
```

Finally, intentionally introduce a bad class to see the hook warning after an edit:

```txt
Change the button background to bg-[#ff00aa] so we can see whether the hook catches it.
```

## Why a hook instead of MCP?

This workflow does not require live external data.

The design-system rules are local and can be packaged as plugin context. The useful automation is feedback after edits, so a `PostToolUse` hook is the smallest useful extension point.

## What this does not do
- no full AST parser;
- no ESLint integration;
- no PR diff scanning;
- no design-token package ingestion;
- no MCP server.

## Note on the examples

The `examples/good/Button.tsx` file imports from `@acme/design-system`, which is demo-only and will not resolve in a real repo. The examples are illustrative fixtures for the audit/migration workflow, not a runnable app.

## Repo structure

```text
.claude-plugin/plugin.json   # plugin manifest
agents/                      # design-system-migrator agent
skills/audit-component/      # audit skill + reference docs
hooks/hooks.json             # PostToolUse checker hook
bin/ds-check.mjs             # dependency-free violation scanner
examples/                    # bad/good fixtures + demo tokens
BUILD_YOUR_OWN_PLUGIN.md     # guide for building your own workflow plugin
```

## Build your own plugin

See [BUILD_YOUR_OWN_PLUGIN.md](./BUILD_YOUR_OWN_PLUGIN.md) for a one-page guide on packaging your own Claude Code workflow plugin for your org.

## With more time

With more time, I would add a configurable token map so each company can point the plugin at its own design-system package. I would also add support for scanning a full PR diff instead of a single file, and collect false positives from the hook to tune the migration rules before broader rollout.
