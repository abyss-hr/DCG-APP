// File: src/theme/index.ts
// Description: Central export hub for all theme utilities and components.
// Import everything from here for cleaner paths across the app.
// Updated: 14. prosinca 2025. - Added icons export

export * from './constants';           // 🎨 Shared constants (opacities, color helpers)
export * from './GradientBackground';  // 🌈 Animated background component
export * from './ThemeGradientLayer';  // 🪄 Reusable header/tab gradient layer
export * from './ThemeProvider';       // ⚙️ Context provider + hook
export * from './typography';          // 📝 Typography tokens and types
export * from './icons';               // 🎯 Icon configuration system (Lucide)

