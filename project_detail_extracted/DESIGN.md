---
name: Atelier Curated
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c19'
  on-tertiary-container: '#838480'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e3e3de'
  tertiary-fixed-dim: '#c6c7c2'
  on-tertiary-fixed: '#1a1c19'
  on-tertiary-fixed-variant: '#454744'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style
The design system is engineered for a high-end digital showroom, catering to discerning clientele in the luxury interior and furniture sectors. The brand personality is sophisticated, architectural, and restrained, evoking the feeling of a private gallery rather than a retail marketplace.

The design style is **High-End Minimalism** with a focus on editorial-grade layouts. It utilizes generous whitespace to give each furniture piece "room to breathe." The aesthetic prioritizes high-quality imagery, using fine 1px lines to define structure without adding visual weight. The emotional response is one of tranquility, exclusivity, and timelessness.

## Colors
The palette is rooted in a classical luxury spectrum. 
- **Deep Charcoal (#121212):** Used for primary typography, iconography, and high-contrast UI elements. It provides a grounded, architectural feel.
- **Warm Champagne (#D4AF37):** Reserved for delicate accents, call-to-action highlights, and premium indicators. It should be used sparingly to maintain its impact.
- **Soft Cream (#F5F5F0):** Serves as the primary background for sections to reduce ocular strain and add a layer of warmth compared to clinical white.
- **Crisp White (#FFFFFF):** Used for cards, product backgrounds (to ensure color accuracy of furniture), and high-light areas.

## Typography
The typography system relies on a high-contrast pairing between a classical serif and a utilitarian sans-serif. 

**Playfair Display** is used for all headlines and editorial pull-quotes. It communicates heritage and craftsmanship. For Arabic and Turkish contexts, ensure the serif's weight is matched by a localized equivalent that preserves the high-contrast stroke ratio.

**Inter** is the workhorse for all functional text, navigation, and descriptions. Its neutral character ensures it does not compete with the furniture photography or the expressive headlines. 

Use `label-caps` for category headers and navigation items to create a rhythmic, structured feel.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop to maintain the editorial integrity of the compositions. 
- **Desktop:** 12-column grid with a 1440px max-width. Margins are intentionally wide (80px) to frame the content like an art book.
- **Spacing Rhythm:** Based on an 8px base unit. Section vertical spacing is intentionally "over-extended" (120px+) to emphasize the luxury of space.
- **Alignment:** Use asymmetrical layouts for product showcases—for example, a large image spanning 7 columns with a floating description box spanning 3 columns in the opposite gutter.

## Elevation & Depth
This design system avoids traditional heavy shadows. Instead, it uses **Tonal Layering** and **Fine Outlines**.

- **Tonal Layers:** Depth is created by placing white cards or images on the Soft Cream background.
- **Glassmorphism:** Navigation bars use a very subtle backdrop blur (20px) with a 60% white tint to maintain visibility over high-detail product photography while remaining light.
- **Outlines:** Use 0.5pt or 1pt lines in a light gray or muted champagne to separate content blocks. 
- **Interactive Depth:** On hover, images should subtly scale (e.g., 1.05x) rather than lifting with a shadow, maintaining a flat, sophisticated photographic feel.

## Shapes
The shape language is strictly **Sharp (0)**. 
Luxury furniture and architectural design often rely on clean lines and precise angles. All buttons, image containers, and input fields must have 0px border-radius. This creates a rigorous, "designed" look that aligns with high-end craftsmanship and distinguishes the interface from mass-market consumer apps.

## Components
- **Buttons:** Primary buttons are solid Charcoal with White text, using a wide horizontal padding. Secondary buttons are "Ghost" style with a 1px Charcoal border. All button text uses `label-caps`.
- **Inputs:** Minimalist bottom-border only. On focus, the border transitions from Light Gray to Warm Champagne.
- **Cards:** Borderless. The focus is entirely on the image, with typography centered or left-aligned underneath in a small, clean font size.
- **Chips/Filters:** Rectangular with a 1px border. Selected state uses a Soft Cream fill and Charcoal text.
- **Lists:** Separated by thin 1px horizontal lines that span the full width of the container, emphasizing the horizontal axis.
- **Specialty Component - "The Lookbook Hover":** When hovering over a furniture piece in a room-scene image, a small, elegant "plus" icon appears, which reveals a minimal product card on click.