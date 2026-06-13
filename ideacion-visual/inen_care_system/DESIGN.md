---
name: INEN Care System
colors:
  surface: '#f8fafb'
  surface-dim: '#d8dadb'
  surface-bright: '#f8fafb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f5'
  surface-container: '#eceeef'
  surface-container-high: '#e6e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#40484b'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#eff1f2'
  outline: '#70787c'
  outline-variant: '#c0c8cb'
  surface-tint: '#306576'
  primary: '#003441'
  on-primary: '#ffffff'
  primary-container: '#0f4c5c'
  on-primary-container: '#87bbce'
  inverse-primary: '#9acee1'
  secondary: '#006e1c'
  on-secondary: '#ffffff'
  secondary-container: '#91f78e'
  on-secondary-container: '#00731e'
  tertiary: '#26322a'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c4840'
  on-tertiary-container: '#aab6ab'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b6ebfe'
  primary-fixed-dim: '#9acee1'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#114d5d'
  secondary-fixed: '#94f990'
  secondary-fixed-dim: '#78dc77'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005313'
  tertiary-fixed: '#d9e6da'
  tertiary-fixed-dim: '#bdcabe'
  on-tertiary-fixed: '#131e17'
  on-tertiary-fixed-variant: '#3e4a41'
  background: '#f8fafb'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
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
  margin-mobile: 16px
  margin-desktop: 40px
  card-padding: 24px
---

## Brand & Style
The design system is engineered for a healthcare environment where clarity, empathy, and accessibility are paramount. The brand personality is **Professional, Supportive, and Accessible**, designed to reduce cognitive load for patients who may be experiencing stress or illness.

The visual style follows a **Corporate / Modern** approach with **Minimalist** influences. It prioritizes information density and readability over decorative elements. The UI utilizes a structured, card-based architecture to organize complex medical data into digestible units. High-contrast ratios and large interactive zones ensure the system is inclusive for users with varying visual and motor capabilities, specifically catering to elderly patients and those in clinical settings.

## Colors
The color palette is anchored in **Deep Teal (#0F4C5C)** to project authority and medical expertise, balanced by **Soft Green (#4CAF50)** to symbolize healing and progress. 

- **Primary:** Used for key navigation, primary actions, and headers.
- **Secondary:** Reserved for progress indicators and positive status affirmations.
- **Surface & Background:** A soft neutral (#F8FAFB) is used to minimize screen glare.
- **Semantic Colors:** Status colors (Green, Yellow, Red) use specific accessible shades that maintain a 4.5:1 contrast ratio against white backgrounds to ensure legibility for all users.

## Typography
This design system utilizes **Inter** for its exceptional legibility and neutral tone. To accommodate multi-language support (Spanish and Quechua), the typography maintains generous line heights to prevent overlapping descenders and provides ample space for longer translated strings.

For maximum accessibility:
- **Body text** never drops below 16px to ensure readability for elderly users.
- **Headlines** use tight letter spacing to maintain a strong visual anchor.
- **Quechua translations** should be styled in `body-md` italicized directly below the primary Spanish text to provide immediate context without cluttering the hierarchy.

## Layout & Spacing
The layout employs a **Fixed Grid** system for desktop, centering the content at 1280px to prevent excessive eye scanning. 

- **Vertical Progress Navigation:** The primary navigation is a persistent left-hand rail on desktop. It uses a "Step-based" visual metaphor, highlighting the patient's current stage in their treatment journey.
- **Grid:** A 12-column grid is used for the main content area. Mobile layouts collapse to a single column with a bottom-anchored navigation bar for thumb-friendly interaction.
- **Spacing Rhythm:** Based on an 8px base unit. Component internal padding is generous (24px) to ensure touch targets are easily tappable for patients with reduced dexterity.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and soft **Ambient Shadows**. Surfaces are tiered to establish hierarchy:
1.  **Background:** The lowest layer in neutral grey.
2.  **Cards:** White surfaces with a very soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)) to suggest they are interactive or contain distinct information.
3.  **Modals/Overlays:** Higher elevation with a darker backdrop dim (40% opacity) to focus the patient's attention on critical tasks like appointment confirmation.
4.  **No High-Contrast Outlines:** Avoid harsh borders; use subtle 1px dividers in light grey (#E0E0E0) for internal card separation.

## Shapes
The design system uses a **Rounded** (0.5rem) shape language. This avoids the clinical "sharpness" of square corners, projecting a friendlier and more approachable medical environment, while remaining more professional than fully pill-shaped "playful" designs.

- **Standard Elements:** 8px (0.5rem) radius for cards and input fields.
- **Large Elements:** 16px (1rem) radius for main containers and hero sections.
- **Interactive Elements:** Buttons use the standard 8px radius for a solid, reliable feel.

## Components
- **Buttons:** Large (minimum 48px height). Primary buttons use the Deep Teal background with white text. Tertiary buttons are text-only with underlined labels for low-priority actions.
- **Status Chips:** Small badges with a light tinted background and dark text (e.g., Green tint with Dark Green text for "Approved").
- **Vulnerability Indicators:** A specific component featuring a high-visibility icon (e.g., a shield or star) and a bold border-left in a distinctive purple accent to alert staff and patients to special care requirements.
- **Timeline Elements:** A vertical line component with "nodes." Completed steps are marked with a green check; the current step is pulsing Teal; future steps are greyed out.
- **Input Fields:** Large labels placed above the field (never inside as placeholders) to ensure accessibility. Borders thicken to 2px Primary Teal on focus.
- **Cards:** The primary container. All patient records, upcoming appointments, and test results must be encapsulated in cards with consistent 24px padding.