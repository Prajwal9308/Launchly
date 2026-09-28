---
name: icon-system
description: PrimeTechLabs icon rules — Lucide only, through the Icons registry, 20/24px, 1.75 stroke, accent colour, one icon per concept, IconTile for containers. Use whenever adding, changing, choosing or reviewing an icon anywhere in this repo (marketing site, client portal, admin), including service icons, activity/notification icons, empty states, buttons and navigation.
---

# PrimeTechLabs icon system

One library, one registry, one visual language. Follow these rules for every icon in this repo. For general placement and hierarchy advice, `ui-ux-pro-max` applies; where it disagrees with this file (for example its `Home` or `Heroicons` examples), this file wins.

## 1. Library: Lucide, through the registry only

- **Lucide React is the only icon library.** Don't use Font Awesome, Heroicons, react-icons, Radix Icons, Tabler, Phosphor, Iconify, emoji, Unicode glyphs (✓ → ●), or hand-drawn SVG icons.
- **Import from `@/components/ui/icons`, never from `lucide-react`.** ESLint (`eslint.config.mjs`) fails the build on a direct `lucide-react` value import or any other icon package. Type-only imports (`LucideIcon`) are allowed.
- **Use icons by concept:** write `<Icons.messages />`, not `<MessageSquare />`. The registry maps each concept to exactly one Lucide icon, using Lucide's current canonical names (for example `House`, `CircleCheck`, `SquareCheckBig`, `LoaderCircle`), never legacy aliases.

```tsx
import { IconTile, Icons } from "@/components/ui/icons";

<Button><Icons.upload aria-hidden /> Upload files</Button>
<IconTile icon={Icons.project} />
```

**Allowed non-Lucide SVGs** (these are artwork, not icons): the brand logo (`components/marketing/logo.tsx`, `app/icon.svg`), the official Google "G" on the sign-in button (brand marks must be the real mark), the progress-ring chart, and the solution sketches.

## 2. One icon per concept

Reuse the existing concept. Never pick a different glyph for the same idea, and never reuse a glyph for an unrelated idea.

| Concept | Key | Don't use instead |
|---|---|---|
| Done or successful (lists, success states) | `success` (CircleCheck) | Check, CheckCircle2, CircleCheckBig |
| Approved or signed off | `approved` (BadgeCheck) | ShieldCheck |
| Messages or conversation | `messages` (MessageSquare) | MessagesSquare, MessageSquareText, MessageSquareReply |
| Upload | `upload` (Upload) | UploadCloud, FileUp |
| Services | `services` (Layers) | Sparkles |
| Tasks | `tasks` (SquareCheckBig) | CheckSquare, ListChecks |
| Home or website | `home` (House) | Home |
| Written scope or quote | `scope` (FilePenLine) | FileSignature |
| AI features only | `ai` (Sparkles) | — (don't use Sparkles for "new", "why us" or services) |
| Notifications and updates | `notifications` (Bell) | BellRing |
| Waiting on someone | `waiting` (Hourglass) | Clock |
| In progress / current step | `current` (CircleDot) | CircleDashed |
| Not started / upcoming | `upcoming` (CircleDashed) | Circle |

- **Need a new concept?** Add one key to `Icons` in `components/ui/icons.tsx`. Choose the glyph with `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<concept>" --domain icons` (then use Lucide's current name for it), and check that no existing key already covers the idea.
- **Database and content keys:** service icons are stored as strings (for example `"monitor"`). Add new ones to `CONTENT_ICONS` in `components/marketing/icons.tsx`, and add them to `SERVICE_ICONS` in `domain/service-icons.ts` if admins should be able to pick them. Never rename an existing service key, because stored rows refer to it.
- **Type-keyed maps must be complete.** Activity and notification icons are `Record<ActivityType | NotificationType, LucideIcon>`, so a new enum value won't compile until it has an icon. Keep them complete; don't use `Partial` or add a fallback.

## 3. Size and stroke

Size and stroke are set once in `app/globals.css` (`:where(svg.lucide)`):

| Use | Size | How |
|---|---|---|
| **Default: every inline, button, nav, list and tab icon** | **20px** | No class needed. Don't add `size-4` or `size-3.5`. |
| Feature icons (feature cards, empty states, hero/CTA tiles) | 24px | `size-6`, or `<IconTile size="lg">`, which sets it |
| Control glyphs inside form controls (checkbox tick, stepper tick) | sized to the control | `className="size-3 [stroke-width:3]"`. Only for `Icons.check` inside a checkbox, radio or step dot. |
| Icons drawn *inside* device mockup screens (`components/marketing/mockups/`) | scales with the screen | `em` sizes such as `size-[1.15em]`. These are part of the illustration, not UI; the device scales as one piece. |

- **Stroke is 1.75 everywhere.** Don't pass `strokeWidth`, because the CSS overrides it anyway. Use the `[stroke-width:…]` utility only for control glyphs.
- **Don't use `!size-*` overrides** or one-off pixel sizes like `size-[18px]`.

## 4. Colour

- **Feature and decorative icons use the accent**, `text-accent`, which is `#2f4fd6` (the `--color-accent` token). Never hard-code a hex value.
- **UI-control icons inherit the text colour** (menu, close, chevrons, search, the icons inside buttons), so they follow button, link and hover states.
- **Nav icons:** idle is `text-faint` (the `ghost` tile), and the active item gets a `solid` accent tile.
- **Status icons use the semantic tokens:** `text-success`, `text-danger`, `text-warning`, `text-info`. Colour is never the only signal; pair it with text or a distinct glyph.
- **On dark (`bg-inverse`) surfaces,** use `tone="inverse"` or `text-white/80`.

## 5. Containers: `IconTile` only

Don't hand-build `flex size-9 items-center justify-center rounded-lg bg-accent-subtle …` spans. Use:

```tsx
<IconTile icon={Icons.files} />                  // md: 40px tile, 20px icon (cards, headings, steps, rows)
<IconTile icon={Icons.files} size="sm" />        // sm: 32px tile, 20px icon (inline with small headings, list rows, nav)
<IconTile icon={Icons.files} size="lg" />        // lg: 48px tile, 24px icon (feature cards, empty states)
<IconTile icon={Icons.project} interactive />    // fills with the accent colour when its `group` parent is hovered or focused
```

The tones are `accent` (the default), `solid` (active or needs attention), `success`, `danger`, `neutral` (files, activity, read items), `ghost` (idle nav) and `inverse` (dark surfaces). Marketing content keys use `IconBadge name="…"` and `NamedIcon`, which wrap the same tile.

## 6. Placement, hierarchy and spacing (from UI UX Pro Max)

- **Icons support text; they don't replace it.** Every icon sits next to a visible label, except the few universal controls (menu, close, search, notifications, more, delete), and those are icon buttons with an `aria-label`.
- **Leading position.** Icons go before the label. A trailing icon only signals where the element goes: `forward` for next or CTA, `external` for a new tab, `chevronRight` for drill-in.
- **Gap.** Use `gap-2` between an icon and its label in buttons and inline text, and `gap-3` to `gap-4` between a tile and its text block.
- **Alignment.** In multi-line lists, align the icon with the first line of text (`items-start`). In single-line rows, centre it (`items-center`).
- **Hierarchy.** Use one icon per element. A tile belongs on the primary item of a card or row, not on every line inside it. Use no more than one tile size within a single list.
- **Consistency.** A repeated list (features, steps, nav) uses the same size, tone and position for every item.
- **Motion.** Change colour on hover; don't scale. The arrow nudge (`translate-x-0.5`) is the only allowed movement, and it's disabled under `motion-reduce`.

## 7. Accessibility

- **Decorative icons are `aria-hidden`.** That's every icon that has a visible label; `IconTile` does it for you.
- **Icon-only buttons need an `aria-label`,** for example `aria-label="Remove logo.png"`, and a hit area of at least 44×44px on touch layouts (`size-11`).
- **Never use an icon as the only way to convey meaning.** Keep the label or a status word.

## 8. Checklist before you finish

- [ ] No `lucide-react` import outside `components/ui/icons.tsx`, and no other icon package, emoji or ad-hoc SVG. Run `npx eslint .`.
- [ ] Every icon is `Icons.<concept>`, reusing an existing concept where one fits.
- [ ] No `size-3`, `size-3.5`, `size-4`, `size-[Npx]` or `!size-*` on icons: 20px by default, `size-6` for feature icons.
- [ ] No `strokeWidth` props.
- [ ] Containers use `IconTile`.
- [ ] Decorative icons are `aria-hidden`, and icon-only buttons have an `aria-label`.
- [ ] Any new `ActivityType` or `NotificationType` has an icon (the build fails otherwise).
