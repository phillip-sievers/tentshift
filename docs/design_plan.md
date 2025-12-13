# TentShift Unified Design Plan

## 1. Design Philosophy

**"Professional, Efficient, Institutional"**
The TentShift interface aligns with Duke University's branding while maintaining a modern, high-performance software aesthetic. The goal is to create a "professional grade" UX that feels trustworthy, snappy, and intuitive for students and administrators.

### Core Principles

- **Clarity over Flash**: Information density should be managed with whitespace, not hidden behind clicks.
- **Predictability**: Interactions (hovers, clicks, focus states) must be consistent across the entire application.
- **Institutional Alignment**: Strict adherence to the Duke University color palette.
- **Feedback-Driven**: Every action provides immediate visual feedback (loading states, success toasts, error borders).
- **Accessibility First**: High contrast ratios (already enforced by Duke Navy text on Light backgrounds) and clear focus indicators.

---

## 2. Visual Foundation

### Color System

We utilize the official Duke University palette, mapped to semantic CSS variables for theme switching (Light/Dark mode).

| Semantic Name   | Duke Color Name                     | Hex / HSL                 | Usage                                             |
| :-------------- | :---------------------------------- | :------------------------ | :------------------------------------------------ |
| **Primary**     | Duke Navy Blue                      | `#012169` / `222 98% 21%` | Main actions, active states, branding elements.   |
| **Secondary**   | Hatteras (Light) / Cast Iron (Dark) | `#E2E6ED` / `#262626`     | Secondary buttons, subtle backgrounds.            |
| **Accent**      | Hatteras                            | `#E2E6ED`                 | Hover states, interactive highlights.             |
| **Destructive** | Copper                              | `#C84E00` / `23 100% 39%` | Delete actions, critical errors.                  |
| **Background**  | White / Cast Iron                   | `#FFFFFF` / `#262626`     | Page backgrounds.                                 |
| **Foreground**  | Duke Navy / White                   | `#012169` / `#FFFFFF`     | Primary text.                                     |
| **Muted**       | Whisper Gray                        | `#F3F2F1`                 | Backgrounds for cards, secondary text containers. |

**Developer Rule**: NEVER hardcode hex values. Always use Tailwind semantic classes like `bg-primary`, `text-primary-foreground`, `border-border`.

### Typography

**Font Family**: `Geist Sans` (primary UI), `Geist Mono` (code/data/tabular).

- **Headings**: Semi-bold (600) or Bold (700). Letter-spacing tight (`-0.02em` typically).
- **Body Text**: Regular (400).
- **Interactive Labels**: Medium (500) for buttons and inputs.
- **Data/Tables**: `Geist Mono` for numeric data where alignment matters (shifts, time slots).

### Spacing & Layout

- **Grid Unit**: 4px (Tailwind standard).
- **Container**: Max-width `1400px` for dashboard views to prevent stretching on readable monitors. Center aligned (`mx-auto`).
- **Padding**:
  - Page containers: `p-4 md:p-6 lg:p-8`.
  - Cards: `p-6`.
  - Compact elements (buttons/inputs): Standard height `h-10` (40px) or small `h-9` (36px).

### Radius & Shape

- **Border Radius**: `0.5rem` (8px) for cards, inputs, and buttons. Soft but structured.
- **Borders**: 1px solid `border-border` (`Limestone`).

---

## 3. Component Standards

### Buttons

- **Primary**: `bg-primary text-primary-foreground hover:bg-primary/90`.
- **Secondary**: `bg-secondary text-secondary-foreground hover:bg-secondary/80`.
- **Ghost**: Used for icon-only actions or non-disruptive controls. `hover:bg-accent hover:text-accent-foreground`.
- **Interaction**: subtle `active:scale-95` transition for tactile feel.

### Cards (Dashboards/Modules)

- **Style**: `bg-card text-card-foreground border border-border shadow-sm`.
- **Elevation**: Minimal. Use shadows sparingly (`shadow-sm`).
- **Header**: Distinct separation with `border-b` if complex actions exist in the card.

### Structure & Tables

- **Header**: Sticky headers (`sticky top-0 z-10 bg-background/95 backdrop-blur support-[backdrop-filter]:bg-background/60`).
- **Rows**: Hover effects on interactive rows (`hover:bg-muted/50`).
- **Striping**: Avoid zebra striping unless data density is extremely high; prefer borders (`border-b`).

---

## 4. UX Patterns

### Loading States

- **Skeleton Screens**: Use `Skeleton` components matching the content shape instead of generic spinners for initial page loads.
- **Button Loading**: When submitting forms, buttons MUST show a spinner and be disabled.

### Feedback

- **Toasts**: Use `sonner` for ephemeral success/error messages.
  - Success: "Schedule updated."
  - Error: "Failed to save shift."
- **Inline Validation**: For form errors, show text in `text-destructive` text-sm directly below the input.

### Animations

- **Transitions**: `transition-all duration-200 ease-in-out` for hover states.
- **Modals/Dialogs**: `animate-in fade-in zoom-in-95` (standard shadcn/radix).

---

## 5. Developer Guide (Future Employees)

### Directory Structure

- `src/components/ui`: Primitive UI elements (Button, Input). **DO NOT MODIFY** logic here heavily; keep them pure.
- `src/components/[feature]`: Feature-specific components (e.g., `dashboard/ShiftTable.tsx`).
- `src/app`: Page routes. Keep logic minimal; delegate to components.

### CSS & Tailwind

- Use `clsx` and `tailwind-merge` (via `cn()` utility) for conditional classes.
- **Avoid** `@apply` in CSS files unless creating a reusable global utility. Prefer utility classes in JSX.

### Icons

- Use `lucide-react` for all iconography.
- Stroke width: `2px` standard, `1.5px` for large decorative icons.
