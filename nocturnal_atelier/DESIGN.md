---
name: Nocturnal Atelier
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c8c8b0'
  on-secondary: '#303221'
  secondary-container: '#494a38'
  on-secondary-container: '#b9baa3'
  tertiary: '#ceced3'
  on-tertiary: '#2f3034'
  tertiary-container: '#b3b2b7'
  on-tertiary-container: '#444549'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e4e4cc'
  secondary-fixed-dim: '#c8c8b0'
  on-secondary-fixed: '#1b1d0e'
  on-secondary-fixed-variant: '#474836'
  tertiary-fixed: '#e3e2e7'
  tertiary-fixed-dim: '#c6c6cb'
  on-tertiary-fixed: '#1a1b1f'
  on-tertiary-fixed-variant: '#46464b'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
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
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The brand personality is anchored in exclusivity, quiet luxury, and artistic curation. It targets a sophisticated audience that values depth, intentionality, and a premium editorial experience. 

The design style is a blend of **Minimalism** and **Glassmorphism**, specifically optimized for a dark environment. It utilizes deep, immersive surfaces with subtle translucent overlays to create a sense of physical space and "infinite" depth. The emotional response should be one of calm focus, high-end craftsmanship, and timeless elegance. All visual elements are secondary to the content, acting as a refined frame for curated imagery and text.

## Colors
The palette shifts from light to a rich, layered dark theme. The base canvas is an absolute "Ink Black" (#0A0A0A), providing maximum contrast for the core surfaces of "Deep Charcoal" (#121212). 

Accent colors are evolved into metallic tones: **Champagne** (#F5F5DC) serves as the primary high-contrast text color, while **Muted Gold** (#D4AF37) is reserved for critical interactions and brand moments. Neutral tones move through a spectrum of **Silver** (#C0C0C0) and **Slate Gray** to maintain legibility without the harshness of pure white.

## Typography
Typography is the primary vehicle for the brand’s editorial feel. High-contrast serif headlines in **Playfair Display** create an authoritative, luxurious hierarchy. These are paired with **Hanken Grotesk**, a sharp and contemporary sans-serif that ensures clarity and modernity in body copy and functional labels.

To maintain readability in dark mode, line heights are slightly increased to prevent "haloing" effects. Tracking is tightened on large displays for a compact, confident look, while small labels receive generous letter spacing to ensure crispness against dark backgrounds.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to preserve the editorial "magazine" feel, transitioning to a fluid model on smaller devices. We utilize a 12-column grid with generous margins to create whitespace (or "darkspace"), emphasizing the premium nature of the content.

Spacing follows a strict 4px base unit. Elements are grouped using large logic-based gaps (64px+) to separate sections, while internal component spacing remains tight and precise (8px - 16px). This creates a rhythmic tension between open, airy layouts and dense, functional UI blocks.

## Elevation & Depth
In this dark mode system, elevation is conveyed through **Tonal Layers** and **Backdrop Blurs** rather than traditional shadows. As an element rises in hierarchy, its surface color becomes lighter (moving from #0A0A0A to #121212 to #1E1E1E).

To add a sense of luxury, floating elements (like menus or modals) use a semi-transparent Deep Charcoal fill with a `20px` background blur and a thin `1px` inner border in a low-opacity Silver (#FFFFFF15). This creates a "glass" effect that feels substantial yet lightweight. Shadows, where used, are oversized, ultra-soft, and tinted with the primary gold color at very low opacity (5%) to simulate a subtle ambient glow.

## Shapes
The shape language is architectural and disciplined. We use **Soft** roundedness (4px - 12px) to take the edge off the brutal black backgrounds without becoming "bubbly" or overly casual. This maintains a balance between precision and approachability. Larger containers like cards use the `rounded-lg` (8px) setting, while small interactive elements like inputs use the base `rounded` (4px).

## Components
- **Buttons:** Primary buttons use a solid Gold fill with Ink Black text. Secondary buttons are "Ghost" style with a Champagne border and text. All buttons use high-tracking uppercase labels for a premium feel.
- **Inputs:** Input fields are defined by a bottom-border only or a very subtle subtle 1px frame in #2C2C2C. When focused, the border transitions to Champagne.
- **Cards:** Cards do not use shadows. They are defined by a slightly lighter surface (#121212) against the background (#0A0A0A) and a subtle top-light stroke to simulate a beveled edge.
- **Chips/Tags:** Small, low-contrast pills using a dark gray background and silver text, used for metadata without distracting from the main imagery.
- **Lists:** Separated by thin, 1px lines in #1E1E1E, ensuring a clean vertical rhythm in data-heavy views.
- **Selection Controls:** Checkboxes and radios use a minimal Gold accent for the "on" state, keeping the "off" state as a simple Charcoal outline.