// src/theme/typography.ts
// Centralized typography tokens, matching your current AppText variants

export type TextVariant =
  | "title"
  | "subtitle"
  | "body"
  | "button"
  | "caption"
  | "homeTitle"
  | "homeSubtitle"
  | "cardButton";

export type FontWeight =
  | "100" | "200" | "300" | "400" | "500"
  | "600" | "700" | "800" | "900"
  | "normal" | "bold";

export type TextToken = {
  fontSize: number;
  lineHeight: number;
  fontWeight: FontWeight;
};

export type Typography = Record<TextVariant, TextToken>;

// 👇 These values are chosen to be VERY close to what you already had
// so when we connect them, your app will look the same (or slightly better)
export const typography: Typography = {
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400", // you had opacity, we’ll keep weight light for now
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
  },
  homeTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
  },
  homeSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  cardButton: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
};
