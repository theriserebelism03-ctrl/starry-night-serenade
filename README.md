# Starry Night Serenade

You are an expert React + Vite developer and creative frontend/UI designer.

Build a premium, cinematic, romantic single-page birthday website using React
(functional components + hooks only, no class components) and Vite as the
build tool. No animation libraries (no GSAP, no Framer Motion, no Lenis) —
everything must be pure CSS animations/transitions plus vanilla JS via
requestAnimationFrame, IntersectionObserver, and scroll events. This is a
hard requirement: nothing should depend on an external CDN script, so a
blocked network request can never silently break the page.

THEME
- Colors: Navy Blue (#071A3D), Black (#000000), Gold (#E8C97A), White
- Glassmorphism cards, soft shadows, twinkling star canvas background
- Georgia / Cormorant Garamond serif typography throughout

CURSOR
- Keep the real system cursor visible (do NOT hide it with cursor:none)
- Two small butterfly sprites (CSS-drawn, flapping wings) trail the cursor
  with slightly different easing/offsets, continuously, on every scene

SCENE 1 — LOCK SCREEN
- Circular profile photo, "Enter Password" title
- 4-digit password input, hardcoded password "2808"
- "Forgot Password?" reveals "Password : 2808 ❤️" on click
- Wrong password: card shake animation + red glow on the input + a short
  synthesized error tone via the Web Audio API (no external sound file)
- Correct password: fade to black, then into Scene 2

SCENE 2 — GRAMOPHONE (music player)
- Antique gramophone image, glowing when a song plays
- Two selectable "vinyl disc" thumbnails (song jukebox), each labeled with
  a track name — clicking one plays that track and spins that disc via a
  pure CSS @keyframes rotation; clicking the other switches tracks cleanly
- If the first track finishes untouched, auto-chain into the second track
  with no gap (no pause between songs)
- Do NOT include any countdown timer or track-duration display — instead,
  show a "Continue the journey →" button as soon as a song has been chosen

SCENE 3 — MEMORY GALLERY
- Grid of 10 "polaroid" photos that fade/scale into view as the user
  scrolls them into the viewport, using IntersectionObserver (not a
  library), staggered slightly per card

SCENE 4 — BOAT JOURNEY (scroll-driven, not a left-to-right slide)
- A tall (~380vh) scroll section with a `position: sticky` viewport
- As the user scrolls DOWN, the boat should feel like it's moving FORWARD
  through the water (not sliding horizontally, not shrinking into the
  distance): scale up gently, sway along a natural S-curve path, while
  3 parallax water layers race underneath it
- Independently of scroll, the boat must ALSO have continuous, realistic
  sailing physics at all times: gentle bobbing (translateY) and pitching
  (rotate), driven by its own always-on CSS @keyframes animation — never a
  static-looking image. Implement this as two separate transformed layers
  (an outer one for scroll-driven scale/sway, an inner one for the
  continuous physics loop) so the two transforms never overwrite each other
- A slideshow of visited-place labels (icon + text) slides in from the
  left edge, one per scroll segment, synced to scroll progress, then slides
  back out before the next appears
- Do NOT include any falling flower petals, flower bursts, or floating
  petal effects anywhere in this scene or any other scene in the site

SCENE 5 — HELLO KITTY
- Character walks in from off-screen with a bounce, carrying a bouquet
- Clicking her reveals a handwritten-style letter overlay (parchment
  background, cursive font, "Close Letter" button) — no flower burst effect

SCENE 6 — CAT
- Grey/black cat walks in carrying a rose
- Clicking the rose blooms it (scale-up transition) and reveals an
  "About Rukmani" placeholder info card with a "Close" button

SCENE 7 — FINAL
- "Thank You ❤️" with a moon, and an "Exit" button that fades to black,
  stops all audio, resets every piece of state, and returns to Scene 1
  ready to replay

GENERAL RULES
- No falling flowers / floating petals ANYWHERE (explicitly removed)
- No music timer / countdown / track-duration display anywhere
- All images/audio are referenced from the /public folder with a leading
  slash (e.g. /photo1.png), never embedded as base64
- Structure as: src/App.jsx (scene state machine) + src/components/*.jsx
  (one component per scene/feature) + src/App.css (all styles)
- Clean, modular, commented code; ready to run with `npm install && npm run dev`
  and deploy to Vercel via GitHub with zero extra config

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f6bab471-06e0-446d-a27d-5a8dd2a06b50).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
