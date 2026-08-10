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

/** Swap/extend this list freely — layout recalculates for any count. */
const IMAGES = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10].map(
  (p, i) => ({ url: p.url, name: p.original_filename || `memory-${i + 1}.png` })
);

const PERSPECTIVE = 1800;

/** Camera sits INSIDE the sphere: distance from the sphere centre to the eye. */
const EYE_FACTOR = 0.62;

function computeRadius() {
  if (typeof window === "undefined") return 1000;
  const m = Math.min(window.innerWidth, window.innerHeight);
  // generous dome: big enough that cards never crowd the eye
  return Math.max(760, Math.min(1500, m * 1.5));
}

/**
 * Push the whole sphere toward the viewer so the eye ends up inside it.
 * Everything at z >= PERSPECTIVE is behind the observer and simply isn't drawn,
 * which is exactly the 360° dome behaviour we want.
 */
const eyeShift = (radius) => PERSPECTIVE - radius * EYE_FACTOR;

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Fibonacci sphere: even, non-clustered distribution, each card faces outward. */
const CARDS = IMAGES.map((img, i) => {
  const n = IMAGES.length;
  const y = 1 - ((i + 0.5) / n) * 2;
  const lat = (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI;
  const lon = (((i * GOLDEN_ANGLE) % (Math.PI * 2)) * 180) / Math.PI;
  return { ...img, lat, lon };
});

const RINGS = [-60, -30, 0, 30, 60];
const MERIDIANS = [0, 30, 60, 90, 120, 150];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const PLACEHOLDER = (label = "Memory") =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450">
      <rect width="600" height="450" fill="#05070f"/>
      <text x="300" y="230" font-family="Georgia, serif" font-size="56" fill="#d8b25a" text-anchor="middle">&#9825;</text>
      <text x="300" y="310" font-family="Georgia, serif" font-size="26" fill="rgba(255,255,255,.65)" text-anchor="middle">${label}</text>
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
      const count = Math.round(clamp((w * h) / 18000, 36, 110));
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
        if (d < 150 && d > 0.01) {
          p.vx += (dx / d) * 0.03;
          p.vy += (dy / d) * 0.03;
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
          if (d2 < 18000) {
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d2 / 18000) * 0.16})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(255,255,255,0.38)";
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, 1.2, 0, Math.PI * 2);
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
  const viewRef = useRef({ rx: -10, ry: 0 });
  const targetRef = useRef({ rx: -10, ry: 0 });
  const rafRef = useRef(null);
  const [view, setView] = useState(viewRef.current);
  const [dragging, setDragging] = useState(false);
  const [radius, setRadius] = useState(computeRadius);

  useEffect(() => {
    const onResize = () => setRadius(computeRadius());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // warm the cache so every card is decoded before it rotates into view
  useEffect(() => {
    for (const img of IMAGES) {
      const pre = new Image();
      pre.decoding = "async";
      pre.src = img.url;
    }
  }, []);

  // butter-smooth lerp toward the target orientation + gentle idle drift
  useEffect(() => {
    const LERP = 0.065;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const t = targetRef.current;
      if (!dragRef.current) t.ry += 0.05; // weightless continuous drift
      const cur = viewRef.current;
      const next = {
        rx: cur.rx + (clamp(t.rx, -80, 80) - cur.rx) * LERP,
        ry: cur.ry + (t.ry - cur.ry) * LERP,
      };
      viewRef.current = next;
      setView(next);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => e.preventDefault();
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e) => {
    dragRef.current = {
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      view: { ...targetRef.current },
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    targetRef.current = {
      ry: d.view.ry + (e.clientX - d.sx) * 0.25,
      rx: clamp(d.view.rx - (e.clientY - d.sy) * 0.25, -80, 80),
    };
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div className="bd-wall-page">
      <NetBackground />

      <div
        ref={stageRef}
        className={`bd-wall-stage${dragging ? " dragging" : ""}`}
        style={{ perspective: `${PERSPECTIVE}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="bd-wall-space"
          style={{
            transform: `translateZ(${eyeShift(radius)}px) rotateX(${view.rx}deg) rotateY(${view.ry}deg)`,
          }}
        >
          {RINGS.map((lat) => {
            const r = radius * Math.cos((lat * Math.PI) / 180);
            return (
              <div
                key={`r${lat}`}
                className="bd-wall-ring"
                style={{
                  width: `${2 * r}px`,
                  height: `${2 * r}px`,
                  marginLeft: `${-r}px`,
                  marginTop: `${-r}px`,
                  transform: `translateY(${-radius * Math.sin((lat * Math.PI) / 180)}px) rotateX(90deg)`,
                }}
              />
            );
          })}
          {MERIDIANS.map((lon) => (
            <div
              key={`m${lon}`}
              className="bd-wall-ring"
              style={{
                width: `${2 * radius}px`,
                height: `${2 * radius}px`,
                marginLeft: `${-radius}px`,
                marginTop: `${-radius}px`,
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
                transform: `rotateY(${c.lon}deg) rotateX(${-c.lat}deg) translateZ(${radius + 18 + (i % 4) * 5}px) rotateY(180deg)`,
              }}
              onClick={() => downloadImage(c.url, c.name)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && downloadImage(c.url, c.name)
              }
            >
              <div className="bd-wall-card-inner">
                <img
                  src={c.url}
                  alt={c.name}
                  draggable="false"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.dataset.fallback === "1") return;
                    el.dataset.fallback = "1";
                    el.src = PLACEHOLDER(c.name);
                    el.classList.add("is-fallback");
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
