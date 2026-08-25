<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 320" width="100%" height="320">
  <defs>
    <style>
      @keyframes neonFlicker {
        0%, 19.99%, 22%, 62.99%, 64%, 64.99%, 70%, 100% {
          opacity: 1;
          filter: drop-shadow(0 0 5px #FFE600) drop-shadow(0 0 15px #FFE600) drop-shadow(0 0 25px #FFB700);
        }
        20%, 21.99%, 63%, 63.99%, 65%, 69.99% {
          opacity: 0.3;
          filter: none;
        }
      }
      @keyframes waveMoveFast {
        0% { transform: translateX(0); }
        100% { transform: translateX(-600px); }
      }
      @keyframes waveMoveSlow {
        0% { transform: translateX(0); }
        100% { transform: translateX(-600px); }
      }
      .neon-title {
        font-family: 'Arial Black', sans-serif;
        font-size: 46px;
        font-weight: 900;
        fill: #FFFFE0;
        animation: neonFlicker 3s infinite alternate;
        letter-spacing: 4px;
      }
      .wave-fast { animation: waveMoveFast 6s linear infinite; }
      .wave-slow { animation: waveMoveSlow 10s linear infinite; }
    </style>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#030B1E"/>
      <stop offset="60%" stop-color="#081B3B"/>
      <stop offset="100%" stop-color="#0F2B5C"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="320" fill="url(#bg)" rx="12"/>

  <g transform="translate(600, 110)" text-anchor="middle">
    <text class="neon-title" x="0" y="0">STARRY NIGHT SERENADE</text>
    <text x="0" y="40" fill="#8AB4F8" font-family="sans-serif" font-size="16" letter-spacing="1">Pure CSS &amp; JS • No Animation Libraries • Single-Page Experience</text>
  </g>

  <g class="wave-slow" opacity="0.6">
    <path d="M0,220 C150,170 350,270 600,220 C850,170 1050,270 1200,220 C1350,170 1550,270 1800,220 L1800,320 L0,320 Z" fill="#1A3B70"/>
  </g>

  <g class="wave-fast" opacity="0.85">
    <path d="M0,240 C200,290 400,190 600,240 C800,290 1000,190 1200,240 C1400,290 1600,190 1800,240 L1800,320 L0,320 Z" fill="#2A5298"/>
    <path d="M0,240 C200,290 400,190 600,240 C800,290 1000,190 1200,240 C1400,290 1600,190 1800,240 L1800,248 C1600,198 1400,298 1200,248 C1000,198 800,298 600,248 C400,198 200,298 0,248 Z" fill="#E0F2FE"/>
  </g>

  <g class="wave-slow">
    <path d="M0,260 C150,220 350,300 600,260 C850,220 1050,300 1200,260 C1350,220 1550,300 1800,260 L1800,320 L0,320 Z" fill="#FFFFFF"/>
    <path d="M0,260 C150,220 350,300 600,260 C850,220 1050,300 1200,260 C1350,220 1550,300 1800,260 L1800,268 C1550,308 1350,228 1200,268 C1050,308 850,228 600,268 C350,308 150,228 0,268 Z" fill="#BAE6FD"/>
  </g>
</svg>
┌─────────────────────────────────────────────────────────────┐
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
