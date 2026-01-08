# DCG-APP Change Notes

This file is a lightweight, human log of important repo changes (especially security/config). Add a new entry whenever you make a meaningful change.

**Agent attribution:** Each entry includes the AI agent name (e.g., Claude Sonnet 4.5, GPT 5.2) for tracking who made the changes.

## 2026-01-07 17:45 CET — Claude Sonnet 4.5
- Created a GitHub backup tag: `backup-2026-01-07` (points to commit `f3849bc`).
- Created a work branch for changes: `feat/work-2026-01-07`.
- Removed hardcoded admin password from the app:
  - `src/components/modals/settings/SettingsModal.tsx` now reads `EXPO_PUBLIC_ADMIN_PASSWORD`.
  - If not set, admin access is disabled for that build.
- Removed Firebase web config from source control:
  - `src/database/firebaseConfig.ts` now reads Firebase config from Expo `extra`.
  - `app.config.js` now passes Firebase config from env vars (`EXPO_PUBLIC_FIREBASE_*`) into `extra`.
- Removed `X-TODOs/` from the repository (deleted from git history going forward).
- Secret scan result (tracked files): no `AIza...` keys and no previous admin password remain.

### Follow-ups / reminders
- If any keys were previously exposed on GitHub, rotate them in Google Cloud / Firebase.
- `.env` stays local (ignored); use EAS Secrets for builds.

## 2026-01-07 18:21 CET — Claude Sonnet 4.5
- Added dependency reference notes: `DEPENDENCIES_NOTES.md`.

## 2026-01-07 19:19 CET — Claude Sonnet 4.5
- Added dependency comparison analysis: `DEPENDENCY_COMPARISON.md`.
  - Compares current DCG stack with recommended expo-playground reference stack.
  - Identifies performance improvements (expo-image, FlashList, React Query).
  - No code changes made (analysis only).

## 2026-01-08 08:37 CET — Claude Sonnet 4.5
- Added phased refactoring plan: `REFACTOR_PLAN.md`.
  - 4 phases: Cleanup → Performance → State Management → Styling/Polish.
  - Detailed step-by-step instructions with timelines, success criteria, and rollback plans.
  - Estimated timeline: 4 days (minimum) to 4-5 weeks (full modernization).
  - No code changes made (planning only).
