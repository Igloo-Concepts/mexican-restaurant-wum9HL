# @rag/template-restaurant

The seed Expo app the AI starts from for every new restaurant project.

The AI freely edits `restaurant.config.ts`, `theme/`, screens, and assets to
produce a unique app for each user. Files in this directory are pushed verbatim
into a fresh GitHub repo when a new project is created.

## Layout presets

`restaurant.config.ts` exposes a `preset` field (`classic | elegant | casual |
modern`). Screens read it to subtly vary spacing, type, and chrome so that
generations don't all feel like the same template.
