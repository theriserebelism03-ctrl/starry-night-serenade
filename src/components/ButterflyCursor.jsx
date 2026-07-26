import { useEffect, useRef } from "react";

/**
 * Two CSS-drawn butterflies that trail the real cursor with different easing.
 * The system cursor stays visible (we never set cursor: none).
 */
export default function ButterflyCursor() {
  const aRef = useRef(null);
  const bRef = useRef(null);

  useEffect(() => {
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const a = { x: target.x, y: target.y };
    const b = { x: target.x, y: target.y };
    let frame;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = (t) => {
      // different easing factors + offsets so they never overlap perfectly
      a.x += (target.x + 26 - a.x) * 0.12;
      a.y += (target.y - 22 - a.y) * 0.12;
      b.x += (target.x - 32 - b.x) * 0.07;
      b.y += (target.y + 16 - b.y) * 0.07;

      const wobbleA = Math.sin(t / 260) * 6;
      const wobbleB = Math.cos(t / 340) * 8;

      if (aRef.current)
        aRef.current.style.transform = `translate3d(${a.x}px, ${a.y + wobbleA}px, 0) rotate(${wobbleA}deg)`;
      if (bRef.current)
        bRef.current.style.transform = `translate3d(${b.x}px, ${b.y + wobbleB}px, 0) rotate(${-wobbleB}deg) scale(0.8)`;

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="bd-butterfly" ref={aRef} aria-hidden="true">
        <span className="wing left" />
        <span className="wing right" />
        <span className="body" />
      </div>
      <div className="bd-butterfly slow" ref={bRef} aria-hidden="true">
        <span className="wing left" />
        <span className="wing right" />
        <span className="body" />
      </div>
    </>
  );
}
