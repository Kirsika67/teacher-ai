# EduAI – õpetaja rakendus

React + Node rakendus klasside, õpilaste, hinnete ja AI tagasiside haldamiseks.

## Kohalik arendus

```bash
npm install
npm run dev
```

Ava brauseris: http://localhost:5173/

## Püsiv link internetis (Render)

1. Pushi see repo GitHubi (`Kirsika67/teacher-ai`).
2. Mine [render.com](https://render.com) → **New** → **Blueprint**.
3. Vali GitHubi repo – Render loeb `render.yaml` automaatselt.
4. Pärast deploy’d saad lingi kujul `https://eduai-xxxx.onrender.com`.

See link töötab ilma sinu arvutita. Tasuta paketil võib esimene avamine pärast pausi võtta ~30 s (server „ärkab“).

### Keskkonnamuutujad Renderis (valikuline)

- `ANTHROPIC_API_KEY` – täis-AI tagasiside jaoks

## Jagamine õpetajale

Saada neile **Renderi link** (mitte `localhost`). Kas:

- **Demo konto:** anna e-post + parool (näevad sinu demoandmeid), või
- **Registreeru:** õpetaja loob oma konto ja lisab klassid ise.
