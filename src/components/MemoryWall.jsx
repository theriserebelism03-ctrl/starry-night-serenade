import { useCallback, useEffect, useRef, useState } from "react";

import photo1 from "@/assets/photo1.png.asset.json";
import photo2 from "@/assets/photo2.png.asset.json";
import photo3 from "@/assets/photo3.png.asset.json";
import photo4 from "@/assets/photo4.png.asset.json";
import photo5 from "@/assets/photo5.png.asset.json";
import photo6 from "@/assets/photo6.png.asset.json";
import photo7 from "@/assets/photo7.png.asset.json";
import photo8 from "@/assets/photo8.png.asset.json";
import photo9 from "@/assets/photo9.png.asset.json";
import photo10 from "@/assets/photo10.png.asset.json";

const PHOTOS = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10];

const RADIUS =
  typeof window !== "undefined"
    ? Math.max(900, Math.min(1600, Math.min(window.innerWidth, window.innerHeight) * 1.7))
    : 1200;

/**
 * Image sources for the sphere. Swap `url` values here to change the gallery —
 * any entry left null falls back to a drawn placeholder card.
 */
const IMAGES = PHOTOS.map((p, i) => ({
  url: p.url ?? null,
  name: p.original_filename || `memory-${i + 1}.png`,
}));

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// warm the browser cache immediately so every card is decoded before it rotates into view
if (typeof window !== "undefined") {
  for (const img of IMAGES) {
    if (!img.url) continue;
    const pre = new Image();
    pre.decoding = "async";
    pre.src = img.url;
  }
}

/** Fibonacci sphere: even, non-clustered distribution facing outward. */
const CARDS = IMAGES.map((img, i) => {
  const n = IMAGES.length;
  const y = 1 - ((i + 0.5) / n) * 2; // -1 .. 1
  const lat = Math.asin(Math.max(-1, Math.min(1, y)));
  const lon = (i * GOLDEN_ANGLE) % (Math.PI * 2);
  return {
    ...img,
    lat: (lat * 180) / Math.PI,
    lon: (lon * 180) / Math.PI,
  };
});

// finer wireframe grid across the expanded sphere
const RINGS = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
const MERIDIANS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Inline SVG placeholder so a failed photo never renders as an empty card. */
const PLACEHOLDER = (label = "Memory") =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0b1430"/><stop offset="100%" stop-color="#000"/>
      </linearGradient></defs>
      <rect width="600" height="600" fill="url(#g)"/>
      <circle cx="300" cy="255" r="86" fill="none" stroke="#d8b25a" stroke-width="4"/>
      <text x="300" y="270" font-family="Georgia, serif" font-size="64" fill="#d8b25a" text-anchor="middle">&#9825;</text>
      <text x="300" y="420" font-family="Georgia, serif" font-size="30" fill="rgba(255,255,255,.7)" text-anchor="middle">${label}</text>
    </svg>`
  );

async function downloadImage(url, name) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 4000);
  } catch {
    window.open(url, "_blank", "noopener");
  }
}

/** Constellation net canvas that reacts to the pointer. */
function NetBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = null;
    let w = 0;
    let h = 0;
    let pts = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(clamp((w * h) / 16000, 40, 130));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      const m = mouseRef.current;

      for (const p of pts) {
        const dx = p.x - m.x;
        const dy = p.y - m.y;
        const d = Math.hypot(dx, dy);
        if (d < 160 && d > 0.01) {
          p.vx += (dx / d) * 0.035;
          p.vy += (dy / d) * 0.035;
        }
        p.vx = clamp(p.vx * 0.985, -1.2, 1.2);
        p.vy = clamp(p.vy * 0.985, -1.2, 1.2);
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;
      }

      for (let i = 0; i < pts.length; i += 1) {
        for (let j = i + 1; j < pts.length; j += 1) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 20000) {
            const a = 1 - d2 / 20000;
            ctx.strokeStyle = `rgba(255, 255, 255, ${a * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="bd-net-canvas" aria-hidden="true" />;
}

/** Full-screen 3D sphere gallery: drag to rotate, ESC to exit, click a card to download. */
export default function MemoryWall({ onExit }) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const viewRef = useRef({ rx: -8, ry: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [view, setView] = useState(viewRef.current);
  const [dragging, setDragging] = useState(false);

  const setBoth = useCallback((next) => {
    viewRef.current = next;
    setView(next);
  }, []);

  // inertia: glide + decelerate after release
  useEffect(() => {
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (dragRef.current) return;
      const v = velRef.current;
      if (Math.abs(v.x) < 0.01 && Math.abs(v.y) < 0.01) {
        if (v.x !== 0 || v.y !== 0) velRef.current = { x: 0, y: 0 };
        return;
      }
      const cur = viewRef.current;
      setBoth({ ry: cur.ry - v.x, rx: clamp(cur.rx - v.y, -80, 80) });
      velRef.current = { x: v.x * 0.972, y: v.y * 0.972 };
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [setBoth]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  // block any scroll/zoom gestures over the stage
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => e.preventDefault();
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e) => {
    velRef.current = { x: 0, y: 0 };
    dragRef.current = {
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      lx: e.clientX,
      ly: e.clientY,
      view: viewRef.current,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
    // exponential smoothing of pointer delta -> stable, jitter-free momentum
    velRef.current = {
      x: velRef.current.x * 0.78 + (e.clientX - d.lx) * 0.25 * 0.22,
      y: velRef.current.y * 0.78 - (e.clientY - d.ly) * 0.25 * 0.22,
    };
    d.lx = e.clientX;
    d.ly = e.clientY;
    setBoth({
      ry: d.view.ry - dx * 0.25,
      rx: clamp(d.view.rx + dy * 0.25, -80, 80),
    });
  };

  const endDrag = () => {
    const d = dragRef.current;
    if (d) d.ended = true;
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div className="bd-wall-page">
      <NetBackground />

      <div
        ref={stageRef}
        className={`bd-wall-stage${dragging ? " dragging" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="bd-wall-space"
          style={{
            transform: `rotateX(${view.rx}deg) rotateY(${view.ry}deg)`,
          }}
        >
          {RINGS.map((lat) => (
            <div
              key={`r${lat}`}
              className="bd-wall-ring"
              style={{
                width: `${2 * RADIUS * Math.cos((lat * Math.PI) / 180)}px`,
                height: `${2 * RADIUS * Math.cos((lat * Math.PI) / 180)}px`,
                marginLeft: `${-RADIUS * Math.cos((lat * Math.PI) / 180)}px`,
                marginTop: `${-RADIUS * Math.cos((lat * Math.PI) / 180)}px`,
                transform: `translateY(${-RADIUS * Math.sin((lat * Math.PI) / 180)}px) rotateX(90deg)`,
              }}
            />
          ))}
          {MERIDIANS.map((lon) => (
            <div
              key={`m${lon}`}
              className="bd-wall-ring"
              style={{
                width: `${2 * RADIUS}px`,
                height: `${2 * RADIUS}px`,
                marginLeft: `${-RADIUS}px`,
                marginTop: `${-RADIUS}px`,
                transform: `rotateY(${lon}deg)`,
              }}
            />
          ))}

          {CARDS.map((c, i) => (
            <figure
              key={c.url}
              className="bd-wall-card"
              role="button"
              tabIndex={0}
              title="Click to download"
              style={{
                transform: `rotateY(${c.lon}deg) rotateX(${-c.lat}deg) translateZ(${RADIUS + 24 + (i % 5) * 6}px)`,
                animationDelay: `${i * 0.35}s`,
              }}
              onClick={() => downloadImage(c.url, c.name)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && downloadImage(c.url, c.name)
              }
            >
              <div className="bd-wall-card-inner">
                <img
                  src={c.url || PLACEHOLDER(c.name)}
                  alt={c.name}
                  draggable="false"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  crossOrigin="anonymous"
                  onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.dataset.fallback === "1") return;
                    el.dataset.fallback = "1";
                    el.removeAttribute("crossorigin");
                    // retry once without CORS attribute, then fall back to a drawn placeholder
                    const retry = new Image();
                    retry.onload = () => {
                      el.src = c.url;
                      el.classList.add("is-loaded");
                    };
                    retry.onerror = () => {
                      el.src = PLACEHOLDER(c.name);
                      el.classList.add("is-loaded", "is-fallback");
                    };
                    retry.src = c.url;
                  }}
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
