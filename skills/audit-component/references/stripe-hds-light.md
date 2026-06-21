> **Demo example only.** This file illustrates a rich token reference for the bundled demo (`examples/tokens.json`). When adopting this plugin, replace it with your team's own reference — do not treat Stripe HDS as a built-in default.

---
version: alpha
name: "Stripe HDS Light"
description: "Typography baseline relies on sohne-var, SF Pro Display, sans-serif for h1 hero headline — large, light-weight, dark navy."
colors:
  brand-lavender: "#7f7dfc"
  pale-background: "#f8fafd"
  surface-white: "#ffffff"
  dark-slate: "#273951"
  slate-body: "#50617a"
  stripe-indigo: "#533afd"
  stripe-orange: "#ff6118"
  subdued-heading: "#64748d"
  deep-navy: "#061b31"
  quiet-surface: "#e5edf5"
typography:
  hero-heading:
    fontFamily: "sohne-var, SF Pro Display, sans-serif"
    fontSize: "44px"
    fontWeight: "300"
    lineHeight: "1.03"
    letterSpacing: "-0.02em"
  section-heading-large:
    fontFamily: "sohne-var, SF Pro Display, sans-serif"
    fontSize: "26px"
    fontWeight: "300"
    lineHeight: "29.12px"
    letterSpacing: "-0.26px"
  section-heading-medium:
    fontFamily: "sohne-var, SF Pro Display, sans-serif"
    fontSize: "22px"
    fontWeight: "300"
    lineHeight: "24.2px"
    letterSpacing: "-0.22px"
  body-default:
    fontFamily: "sohne-var, SF Pro Display, sans-serif"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "22.4px"
  body-light:
    fontFamily: "sohne-var, SF Pro Display, sans-serif"
    fontSize: "16px"
    fontWeight: "300"
    lineHeight: "22.4px"
  label-default:
    fontFamily: "sohne-var, SF Pro Display, sans-serif"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "14px"
  caption-small:
    fontFamily: "sohne-var, SF Pro Display, sans-serif"
    fontSize: "11px"
    fontWeight: "300"
    lineHeight: "15.95px"
  micro-label:
    fontFamily: "sohne-var, SF Pro Display, sans-serif"
    fontSize: "10px"
    fontWeight: "400"
    lineHeight: "14.5px"
    letterSpacing: "0.1px"
rounded:
  radius-none: "0px"
  radius-xs: "1px"
  radius-sm: "4px"
  radius-md: "6px"
  radius-lg: "8px"
  radius-xl: "16px"
spacing:
  space-1: "2px"
  space-2: "4px"
  space-3: "6px"
  space-4: "8px"
  space-5: "10px"
  space-6: "12px"
  space-7: "16px"
  space-8: "20px"
  space-9: "24px"
  space-10: "32px"
  space-11: "40px"
  space-12: "44px"
  space-13: "64px"
  space-14: "96px"
---

# Stripe HDS Light — Design Token Reference

Full extracted token set for audits and migrations. Do not invent tokens outside this reference.

## Overview

- **Base grid:** 8px with scale values 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 44, 64, 96, 152, 160.
- **Signature traits:** Consistent color, spacing, and radius rhythm across visible UI.

## Semantic color roles

| Semantic role | Token | Hex | Usage |
|---------------|-------|-----|-------|
| action-text | `stripe-indigo` | `#533afd` | Primary CTA buttons, links, accent borders, charm backgrounds, icon fills |
| action-border | `deep-navy` | `#061b31` | Primary headings, solid text, secondary/ghost button borders |
| action-background | `surface-white` | `#ffffff` | Page and card surfaces; text-on-solid on dark/brand buttons |
| content-text | `subdued-heading` | `#64748d` | Subdued headings and secondary icon fills |

## Color tokens

### Text

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| `dark-slate` | `#273951` | text | Input labels, selected text, popover text |
| `slate-body` | `#50617a` | text | Body copy, navigation links, secondary labels |
| `stripe-indigo` | `#533afd` | text | Primary brand color — CTAs, links, accents |
| `stripe-orange` | `#ff6118` | text | Accent orange — sign-up CTA, orange icon accents |
| `subdued-heading` | `#64748d` | text | Subdued headings, secondary icon fills |

### Interactive

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| `deep-navy` | `#061b31` | border | Primary headings, solid text, button borders |
| `quiet-surface` | `#e5edf5` | border | Subtle borders, dividers, quiet surface fills |

### Surface

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| `brand-lavender` | `#7f7dfc` | background | Gradient starts, selector active states, charm gradient |
| `pale-background` | `#f8fafd` | background | Quiet page background for alternating sections |
| `surface-white` | `#ffffff` | background | Page and card surfaces |

## Typography tokens

Font stack throughout: `sohne-var, SF Pro Display, sans-serif`

| Token | Size | Weight | Line height | Letter spacing | Role |
|-------|------|--------|-------------|----------------|------|
| `hero-heading` | 44px | 300 | 1.03 | -0.02em | H1 hero headline — large, light-weight, dark navy |
| `section-heading-large` | 26px | 300 | 29.12px | -0.26px | Section headings and feature titles |
| `section-heading-medium` | 22px | 300 | 24.2px | -0.22px | Sub-section headings and card titles |
| `body-default` | 16px | 400 | 22.4px | normal | Primary body copy, navigation, prose |
| `body-light` | 16px | 300 | 22.4px | normal | Secondary body copy, descriptive blocks |
| `label-default` | 14px | 400 | 14px | normal | Button labels, form labels, UI control text |
| `caption-small` | 11px | 300 | 15.95px | normal | Captions, footnotes, micro-labels |
| `micro-label` | 10px | 400 | 14.5px | 0.1px | Badges, tags, smallest UI labels |

## Spacing tokens

| Token | Value | Notes |
|-------|-------|-------|
| `space-1` | 2px | Mapped to `--hds-space-core-25` |
| `space-2` | 4px | Mapped to `--hds-space-core-50` |
| `space-3` | 6px | |
| `space-4` | 8px | |
| `space-5` | 10px | |
| `space-6` | 12px | |
| `space-7` | 16px | Mapped to `--navigation-inline-end` |
| `space-8` | 20px | Mapped to `--hds-space-core-250` |
| `space-9` | 24px | Mapped to `--hds-space-core-300` |
| `space-10` | 32px | |
| `space-11` | 40px | |
| `space-12` | 44px | Mapped to `--hds-space-core-550` |
| `space-13` | 64px | |
| `space-14` | 96px | |

## Radius tokens

| Token | Value | Role |
|-------|-------|------|
| `radius-none` | 0px | Hairline corner |
| `radius-xs` | 1px | Hairline corner |
| `radius-sm` | 4px | Subtle corner |
| `radius-md` | 6px | Subtle corner |
| `radius-lg` | 8px | Control corner |
| `radius-xl` | 16px | Card corner |

## Shadow tokens

Keep depth flat unless a validated shadow token applies.

| Token | Value |
|-------|-------|
| `shadow-sm-bottom` | `0px 2px 5px 0px rgba(0, 0, 0, 0.1)` |
| `shadow-md-bottom` | `0px 15px 35px 0px rgba(23, 23, 23, 0.08)` |
| `shadow-md-subtle` | `0px 3px 6px 0px rgba(23, 23, 23, 0.06)` |
| `shadow-lg-bottom` | `0px 16px 32px 0px rgba(50, 50, 93, 0.12)` |
| `shadow-xl-diffuse` | `0px 20.187px 40.374px -20.187px rgba(0, 0, 0, 0.1)` |

## Interaction signals (Light theme)

| Signal | Evidence |
|--------|----------|
| backdrop-filter | `blur(12px)` |
| outline-style | solid |
| outline-color | `rgb(0, 0, 0)`, `rgb(83, 58, 253)`, `rgb(6, 27, 49)` |
| outline-width | 3px, 1px |
| outline-offset | 0px, -1px |

## Guardrails

| Do | Don't |
|----|-------|
| Maintain consistent spacing using the 8px base grid | Make unsupported claims about absent visual features |
| Maintain WCAG AA contrast ratios (4.5:1 for normal text) | Mix rounded and sharp corners in the same view |
| Use primary color only for the single most important action per screen | Invent shadows beyond validated evidence |
| Verify evidence before writing new design-system guidance | Invent tokens not listed in this reference |

## Audit mapping hints

When migrating hardcoded values, prefer these replacements:

- `#533afd`, `#7f7dfc` → `stripe-indigo` / `brand-lavender`
- `#061b31`, `#273951` → `deep-navy` / `dark-slate`
- `#50617a`, `#64748d` → `slate-body` / `subdued-heading`
- `#f8fafd`, `#e5edf5` → `pale-background` / `quiet-surface`
- `#ffffff` → `surface-white`
- `#ff6118` → `stripe-orange`
- Arbitrary spacing (e.g. `13px`, `7px`) → nearest `space-*` token
- Arbitrary radius (e.g. `9px`) → nearest `radius-*` token (`radius-lg` = 8px, `radius-xl` = 16px)
