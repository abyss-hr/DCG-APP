// File: src/theme/constants.ts
// Description: Theme constants for gradients and opacities used across the app.

export const DEFAULT_HEADER_GRADIENT: [string, string] = ['#FFFFFF', '#F5F5F5'];
export const DEFAULT_TAB_GRADIENT: [string, string] = ['#FFFFFF', '#FAFAFA'];

export const DEFAULT_HEADER_OPACITY = 0.95;
export const DEFAULT_TAB_OPACITY = 0.98;

// Helper: append alpha to hex color (expects 6-char hex without #)
export function applyAlpha(hex: string, opacity: number) {
  // allow both #RRGGBB and RRGGBB
  const clean = hex.replace('#', '');
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return (clean.length === 6 ? `#${clean}${alpha}` : `#${clean}${alpha}`);
}
