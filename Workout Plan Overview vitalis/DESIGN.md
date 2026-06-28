---
name: Vitalis
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#c9c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#929090'
  on-tertiary-container: '#2a2a2a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style
The design system is built for a high-end consumer health and performance platform. It focuses on human-centric movement, treating the interface as an extension of the body’s own anatomy. The brand personality is disciplined yet empathetic, evoking a sense of peak performance and deep physiological understanding.

The visual style is a blend of **Glassmorphism** and **Tactile Minimalism**. It avoids flat surfaces entirely, opting for "living" backgrounds characterized by radial lighting and flowing contour lines that mimic muscle fibers and biological rhythms. The emotional response is one of focus, premium quality, and technological sophistication. High-contrast typography and expressive whitespace ensure that every interaction feels intentional and authoritative.

## Colors
The palette is rooted in a deep, nocturnal foundation to allow the "Electric Indigo" to vibrate with energy.

- **Primary (Electric Indigo):** Used sparingly for high-action focal points, focus states, and bio-metric data visualization.
- **Surface (Deep Charcoal):** The base of the application. It is never rendered as a flat hex code; it must always be treated with a subtle radial gradient or a faint grain texture to maintain depth.
- **Accents:** Anatomical contour lines should be rendered in a low-opacity Indigo or a muted Charcoal tint (#1E1E2E) to create a sense of skeletal structure beneath the UI.
- **Backgrounds:** Use a central radial light source (Indigo-tinted) that falls off into the Deep Charcoal edges, creating a "stage" effect for the content.

## Typography
This design system uses **Hanken Grotesk** exclusively to maintain a sharp, contemporary, and technical feel. 

Typography is used expressively with high contrast between massive display headers and compact, functional body text. Headlines should be tightly tracked to feel dense and powerful. Use "Label-Caps" for secondary data points and metadata to provide a technical, instrument-like aesthetic. All text should be rendered with high legibility in mind, using off-white or silver-grey on the dark background to prevent optical vibrating.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to evoke a sense of premium "breathing room." 

- **Desktop:** 12-column grid with wide 64px external margins. Content is often centered in a "hero" column (6-8 columns wide) to maintain focus.
- **Mobile:** 4-column grid with 20px margins. 
- **Rhythm:** Use an 8px base unit for all padding and margins. Vertical rhythm should be exaggerated; use larger gaps between sections (80px - 120px) to allow the "anatomical contour lines" in the background to be seen. Elements should feel like they are floating in an organic space rather than being boxed into a rigid container.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layering** and **Internal Shadows**, rather than traditional drop shadows.

- **Surfaces:** Containers use a semi-transparent dark fill with a `backdrop-filter: blur(20px)`. This creates a frosted-glass effect that reveals the contour lines underneath.
- **Internal Depth:** Inputs and cards should feature a subtle inner shadow (inset) to appear as if they are molded into the interface.
- **Glows:** Active elements utilize a soft, 20-40px Indigo outer glow (bloom) rather than a hard shadow. This simulates the light emitted from a high-tech medical display or a bio-luminescent organism.

## Shapes
The shape language is organic and ergonomic. 

Standard components use `rounded-lg` (1rem/16px) for a soft but structured feel. Larger cards and containers use `rounded-xl` (1.5rem/24px) to mimic the curves of the human body. Avoid sharp corners entirely; every touchpoint should feel smooth and approachable. Buttons and interactive chips may lean towards a pill-shape (3.0rem) when used for high-velocity actions like "Start Workout."

## Components
- **Buttons:** Tactile and elevated. Use a very subtle linear gradient (Indigo to a slightly darker Violet) and a 1px inner highlight on the top edge to simulate a physical edge. No flat fills.
- **Input Fields:** These are elegant, borderless containers with a darker-than-background fill. On focus, the container should "inhale"—deepening the internal shadow and activating a gentle Indigo pulse.
- **Cards:** Never flat. Cards must have a subtle gradient background and a `0.5px` stroke of Indigo at 10% opacity to define the edge. They should appear to float slightly above the contour lines.
- **Progress Indicators:** Use glowing, fluid lines. Movement should be eased with `cubic-bezier(0.4, 0, 0.2, 1)` to mimic natural human motion.
- **Chips:** Small, pill-shaped indicators with high-transparency backgrounds and high-contrast Hanken Grotesk labels.