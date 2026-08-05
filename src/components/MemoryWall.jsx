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

/** Deterministic scatter across X / Y / Z space. */
const CARDS = PHOTOS.map((p, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return {
    url: p.url,
    x: (col - 1.5) * 300 + ((i * 53) % 90) - 45,
    y: (row - 1) * 280 + ((i * 37) % 70) - 35,
    z: -600 + ((i * 173) % 900),
    rot: ((i * 29) % 14) - 7,
  };
});

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

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
            ctx.strokeStyle = `rgba(232, 201, 122, ${a * 0.28})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(255,255,255,0.55)";
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

/** Full-screen 3D spatial photo gallery: drag to pan/orbit, wheel to zoom. */
export default function MemoryWall({ onExit }) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const viewRef = useRef({ x: 0, y: 0, zoom: 1, rx: 0, ry: 0 });
  const [view, setView] = useState(viewRef.current);
  const [dragging, setDragging] = useState(false);

  const setBoth = useCallback((next) => {
    viewRef.current = next;
    setView(next);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  // non-passive wheel zoom
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const v = viewRef.current;
      setBoth({ ...v, zoom: clamp(v.zoom * Math.exp(-dy * 0.0015), 0.4, 2.6) });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setBoth]);

  const onPointerDown = (e) => {
    dragRef.current = {
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      view: viewRef.current,
      orbit: e.shiftKey || e.button === 2,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (d.orbit) {
      setBoth({
        ...d.view,
        ry: clamp(d.view.ry + dx * 0.12, -35, 35),
        rx: clamp(d.view.rx - dy * 0.12, -25, 25),
      });
    } else {
      setBoth({ ...d.view, x: d.view.x + dx, y: d.view.y + dy });
    }
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div className="bd-wall-page">
      <NetBackground />

      <button type="button" className="bd-btn bd-wall-exit" onClick={onExit}>
        ← Exit
      </button>

      <div className="bd-wall-head">
        <h2 className="bd-title bd-wall-title">Memory Wall</h2>
        <p className="bd-sub">drag to pan · shift + drag to orbit · scroll to zoom</p>
      </div>

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
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.zoom}) rotateX(${view.rx}deg) rotateY(${view.ry}deg)`,
          }}
        >
          {CARDS.map((c, i) => (
            <figure
              key={c.url}
              className="bd-wall-card"
              style={{
                transform: `translate3d(${c.x}px, ${c.y}px, ${c.z}px) rotate(${c.rot}deg)`,
                animationDelay: `${i * 0.35}s`,
              }}
            >
              <div className="bd-wall-card-inner">
                <img src={c.url} alt="" draggable="false" loading="lazy" />
              </div>
            </figure>
          ))}
        </div>
      </div>

      <div className="bd-wall-hint bd-glass">
        <button
          type="button"
          className="bd-btn"
          onClick={() => setBoth({ x: 0, y: 0, zoom: 1, rx: 0, ry: 0 })}
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
