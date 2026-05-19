# Design System Document: High-End Editorial Wedding Experience

## 1. Overview & Creative North Star: "The Ethereal Editorial"
The objective of this design system is to transcend the "template" nature of digital wedding invitations. We are not building a form; we are designing a digital keepsake. 

**Creative North Star: The Ethereal Editorial.**
This system mimics the tactile experience of high-end stationery laid across a silk surface. It breaks the traditional web grid by using intentional asymmetry, overlapping botanical elements, and a "breathable" layout that prioritizes white space as a luxury feature. Every interaction should feel serene, deliberate, and premium.

---

## 2. Colors & Tonal Depth
Our palette is rooted in the natural world—sage, ivory, and olive—evoking a sense of organic growth and timelessness.

### The Palette (Material Design Convention)
*   **Primary (`#5b6143`):** A sophisticated olive-sage for high-intent actions and deep contrast.
*   **Surface (`#faf9f6`):** Our foundation—a warm ivory that feels softer and more expensive than pure white.
*   **Secondary/Tertiary (`#615f50` / `#675c5a`):** Muted tones for supporting elements and soft botanical accents.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections. High-end design is felt, not outlined. Boundaries must be defined through:
1.  **Background Shifts:** Transitioning from `surface` to `surface-container-low`.
2.  **Negative Space:** Using the spacing scale to create mental boundaries.
3.  **Tonal Transitions:** Soft, overlapping surfaces that suggest containment without a "box."

### Surface Hierarchy & Glassmorphism
Treat the UI as a series of stacked, fine-paper sheets. 
*   **Nesting:** Place a `surface-container-lowest` card (pure white) on top of a `surface-container` background to create a soft, natural lift.
*   **The Glass Effect:** For floating navigation or modals, use `surface-container-lowest` at 70% opacity with a `20px` backdrop-blur. This "frosted glass" effect allows the sage and blush tones to bleed through, integrating the UI into the environment.

---

## 3. Typography: The Romantic Dialogue
The typography system relies on the tension between a high-contrast, romantic serif and a modern, functional sans-serif.

*   **Display & Headlines (Noto Serif):** These are your "jewelry." Use `display-lg` for names and dates. The high contrast of Noto Serif conveys elegance and "Editorial" authority.
*   **Body & Titles (Manrope):** A clean, humanist sans-serif. It provides a modern counterpoint to the serif, ensuring that logistical details (locations, times) remain perfectly legible.
*   **Stylistic Note:** For `label-md` and `title-sm`, increase letter-spacing by `0.05em` to mimic the look of luxury boutique branding.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too heavy for this aesthetic. We use light and tone to imply height.

*   **The Layering Principle:** Depth is achieved by stacking surface tiers. A card should be one tier "brighter" than the section it sits upon.
*   **Ambient Shadows:** If a shadow is required for a floating CTA or modal, use a "Tinted Ambient Shadow." 
    *   **Color:** Use the `primary` or `on-surface` color at 6% opacity.
    *   **Blur:** High diffusion (e.g., `40px` blur, `10px` Y-offset). Never use pure black or grey.
*   **The "Ghost Border" Fallback:** For accessibility in input fields, use the `outline-variant` token at **15% opacity**. This creates a "suggestion" of a container rather than a hard cage.

---

## 5. Components

### Buttons
*   **Primary:** High-rounded edges (`rounded-full`). Use a subtle gradient from `primary` to `primary-container` to add "soul" and depth. Text is `on-primary` (white).
*   **Tertiary:** No background or border. Use `title-sm` with a subtle botanical icon as a prefix.

### Cards
*   **Style:** No borders. Corners must be `xl` (1.5rem). 
*   **Separation:** Forbid the use of divider lines. Separate content using the Spacing Scale (minimum `2rem` vertical gap) or a shift to `surface-container-low`.

### Inputs & Forms
*   **Style:** Minimalist. Use a `surface-container-lowest` background with a 15% opacity "Ghost Border."
*   **Focus State:** The border opacity increases to 100% using the `primary` color. No heavy glow effects.

### Botanical Accents (Signature Element)
*   Integrate line-art floral illustrations that "break the container." An illustration should sit half-in and half-out of a card or section to create visual flow and an organic, un-templated feel.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Place text on the left and a botanical element slightly offset on the right. 
*   **Prioritize White Space:** If a section feels "busy," add another `24px` of padding. Luxury is the ability to waste space.
*   **Use Tonal Shifts:** Always check if a background color change can replace a divider line.

### Don’t:
*   **Don't use 100% Black:** Use `on-surface` (`#1a1c1a`) for text. It’s a soft charcoal that feels more natural against ivory.
*   **Don't use standard "Drop Shadows":** Grey shadows make the design look like a generic SaaS product.
*   **Don't crowd the edges:** Elements should never feel "trapped" near the edge of a card or screen. Maintain a minimum of `2rem` (32px) padding for all main containers.

---

## 7. Interaction Design
*   **Hover States:** Transitions should be slow (`300ms`) and use "Ease-in-out." A hover on a card should result in a very slight "lift" (increasing the shadow diffusion) rather than a color flash.
*   **Loading States:** Use a shimmer effect that moves from `surface-container` to `surface-bright`. Avoid harsh loading spinners; use a fading botanical icon if possible.