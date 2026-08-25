<!-- CONTINUOUSLY MOVING ANIMATED HEADER WAVE -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=071A3D&height=220&section=header&text=Starry%20Night%20Serenade&fontSize=42&fontColor=E8C97A&animation=waving" alt="Header Banner" width="100%" />
</p>

<!-- TAGLINE & BADGES -->
<p align="center">
  <em>✨ A cinematic, romantic single-page experience built with zero external animation libraries ✨</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Animations-Pure%20CSS%20%2B%20JS-E8C97A?style=for-the-badge" alt="Pure CSS" />
  <img src="https://img.shields.io/badge/Audio-Web%20Audio%20API-071A3D?style=for-the-badge" alt="Web Audio" />
</p>

---

## 🌌 Overview

**Starry Night Serenade** is a hand-crafted, high-performance web presentation engineered without any external animation CDNs (no GSAP, Framer Motion, or Lenis). All interactions rely strictly on **Pure CSS Keyframes**, **`requestAnimationFrame`**, and the **IntersectionObserver API**.
─────────────────────────────────────────────────────────────┐
│ 🔐 Scene 1: Lock Screen (Password: 2808)                    │
│ 🎵 Scene 2: Antique Gramophone Jukebox                      │
│ 📸 Scene 3: Scroll-Triggered Polaroid Gallery               │
│ ⛵ Scene 4: 380vh Sticky Parallax Boat Journey              │
│ 💌 Scene 5: Hello Kitty Interactive Letter                  │
└─────────────────────────────────────────────────────────────┘
---

## ✨ Key Motion Features & Interactions

* **🦋 Dual Butterfly Cursor Trail** — Two CSS-drawn butterfly sprites track system cursor movements with independent spring easing.
* **🔒 Web Audio Haptic Lock Screen** — Custom synthesized error frequency tones on incorrect attempts, with a full black transition on success.
* **💿 Continuous Vinyl Jukebox** — Seamless auto-chaining vinyl rotation without track duration timers or audio gaps.
* **⛵ 380vh Scroll-Driven Boat Physics** — Dual-layer transform setup separating continuous bobbing/pitching keyframes from 3D scroll-driven path swaying.

---

## 🛠️ Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Framework & Build** | React 18 (Functional Hooks), Vite, TypeScript |
| **Styling & Theme** | Pure CSS3 (Glassmorphism, CSS Variables, Custom Serif Typography) |
| **Audio Engine** | Web Audio API (Synthesizers), HTML5 Audio Element |
| **Performance** | IntersectionObserver, `requestAnimationFrame`, Zero Third-Party Motion CDNs |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone [https://github.com/theriserebelism03-ctrl/starry-night-serenade.git](https://github.com/theriserebelism03-ctrl/starry-night-serenade.git)

# Navigate into project directory
cd starry-night-serenade

# Install dependencies via Bun
bun install

# Start local development server
bun run dev
