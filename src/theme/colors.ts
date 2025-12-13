// File: src/theme/colors.ts
// Description: Modern, reduced, elegant color system for tourist-oriented apps.
// Updated: November 2025 (DCG Optimized Version)

export type ColorTheme = {
  mode: 'light' | 'dark';

  // 🔤 Text
  text: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;

  // 🎨 Backgrounds
  background: string;
  backgroundDark: string;
  transparent: string;

  // 🌈 Gradients
  backgroundGradient: [string, string, string, string];
  headerGradient: [string, string];
  headerOpacity: number;
  tabGradient: [string, string];
  tabOpacity: number;

  // 🔘 Buttons
  button: string;
  buttonMenu: string;
  buttonActive: string;
  buttonInactive: string;

  // 💠 Cards
  cardBackground: string;
  cardBorder: string;
  cardButtonBackground: string;
  cardButtonTitle: string;

  // 🗂️ Modal
  modalBackground: string;
  modalBorder: string;

  // 🧭 Navigation Icons
  headerIcon: string;
  tabIconActive: string;
  tabIconInactive: string;

  // 📐 UI Elements
  border: string;

  // ❤️ States
  favorite: string;
  error: string;
  disabled: string;
};

/* ───────────────────────────────
   🌤 LIGHT THEME — Mediterranean Luxury
   Clean white, soft blue, warm gold accents
──────────────────────────────── */
export const lightTheme: ColorTheme = {
  mode: 'light',

  // TEXT
  text: "#1a1d24",
  title: "#0f172a",
  subtitle: "#475569",
  description: "#4b5563",
  location: "#64748b",

  // BACKGROUND
  background: "#fdfdfd",
  backgroundDark: "#eef6ff",
  transparent: "rgba(255, 255, 255, 0.32)",

  // GRADIENTS
  backgroundGradient: ["#ffffff", "#ffffff", "#f4fbff", "#e0f4ff"],
  headerGradient: ["#ffffff", "#e6f4ff"],
  headerOpacity: 1,
  tabGradient: ["#e8f5ff", "#ffffff"],
  tabOpacity: 1,

  // BUTTONS
  button: "#1ba4ce",        // primary action
  buttonMenu: "#062347",    // deep navy
  buttonActive: "#08779c",
  buttonInactive: "#a7d8e9",

  // CARDS
  cardBackground: "rgba(255, 255, 255, 0.65)",
  cardBorder: "rgba(0, 55, 110, 0.15)",
  cardButtonBackground: "rgba(255, 255, 255, 0.85)",
  cardButtonTitle: "#0f172a",

  // MODAL
  modalBackground: "#ffffff",
  modalBorder: "rgba(0, 55, 110, 0.25)",

  // NAV ICONS
  headerIcon: "#062347",
  tabIconActive: "#054a91",       // strong premium blue
  tabIconInactive: "rgba(5, 74, 145, 0.55)",

  // UI ELEMENTS
  border: "rgba(27, 140, 195, 0.45)",

  // STATES
  favorite: "#ff3f81",
  error: "#ef4444",
  disabled: "#d6dbe3",
};

/* ───────────────────────────────
   🌌 DARK THEME — Deep Navy + Teal Glow
   Premium night-mode aesthetic
──────────────────────────────── */
export const darkTheme: ColorTheme = {
  mode: "dark",

  // TEXT
  text: "#dce3ed",
  title: "#f1f5f9",
  subtitle: "#c0cad6",
  description: "#d2d9e3",
  location: "#9ba7b4",

  // BACKGROUND
  background: "#0c1628",
  backgroundDark: "#08101f",
  transparent: "rgba(0, 0, 0, 0.25)",

  // GRADIENTS
  backgroundGradient: ["#020a18", "#062347", "#1b3a6b", "#0f6fa4"],
  headerGradient: ["#062347", "#021225"],
  headerOpacity: 1,
  tabGradient: ["#021225", "#0c3d61"],
  tabOpacity: 1,

  // BUTTONS
  button: "#4fcbd1",
  buttonMenu: "#6debea",
  buttonActive: "#5ed4d4",
  buttonInactive: "#3b4c5f",

  // CARDS
  cardBackground: "rgba(15, 26, 45, 0.28)",
  cardBorder: "rgba(85, 161, 237, 0.28)",
  cardButtonBackground: "rgba(40, 45, 56, 0.75)",
  cardButtonTitle: "#f6f6f6",

  // MODAL
  modalBackground: "#0d1a2b",
  modalBorder: "rgba(85, 161, 237, 0.45)",

  // NAV ICONS
  headerIcon: "#5ed4d4",
  tabIconActive: "#20f3ef",
  tabIconInactive: "rgba(32, 243, 239, 0.50)",

  // UI ELEMENTS
  border: "rgba(80, 130, 180, 0.35)",

  // STATES
  favorite: "#ff3f81",
  error: "#ef4444",
  disabled: "#475569",
};

/* SELECTOR */
export const themeFor = (scheme: "light" | "dark" | null | undefined) =>
  scheme === "dark" ? darkTheme : lightTheme;
