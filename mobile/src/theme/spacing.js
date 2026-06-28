/**
 * Vitalis Design System — Spacing & Radii
 *
 * 8px base unit system from DESIGN.md.
 */

const Spacing = {
  // ── Base unit ──
  unit: 8,

  // ── Scale (multiples of 8) ──
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,

  // ── Layout ──
  marginMobile:  20,
  marginDesktop: 64,
  gutter:        24,
  containerMax:  1280,

  // ── Section gaps (per DESIGN.md: 80-120px between sections) ──
  sectionGap:    80,
  sectionGapLg: 120,

  // ── Border Radii ──
  radiusSm:   4,    // 0.25rem
  radius:     8,    // 0.5rem
  radiusMd:  12,    // 0.75rem
  radiusLg:  16,    // 1rem
  radiusXl:  24,    // 1.5rem
  radiusFull: 9999, // pill
};

export default Spacing;
