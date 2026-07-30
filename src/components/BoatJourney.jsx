import { useEffect, useRef, useState } from "react";

const PLACES = [
  { icon: "🌱", text: "Our friendship started on Aug 25th" },
  { icon: "🍱", text: "Our first convo for packing food" },
  { icon: "🚌", text: "MGM trip" },
  { icon: "🏺", text: "Sports day & pottery making" },
  { icon: "🍛", text: "Canteen with 65 briyani" },
  { icon: "🌇", text: "Waiting at evening" },
];

/**
 * Scene 4 — scroll-driven boat journey.
 * Outer layer: scroll-driven scale + S-curve sway (forward motion).
 * Inner layer: always-on CSS keyframe bobbing/pitching physics.
 * Three parallax water layers race underneath. No petals anywhere.
 */
export default function BoatJourney() {
  const sectionRef = useRef(null);
  const boatRef = useRef(null);
  const waterRefs = [useRef(null), useRef(null), useRef(null)];
  const [segment, setSegment] = useState(-1);

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / (total || 1))); // 0 → 1

      // forward motion: sails left → right with a gentle bob and scale swell
      const travel = (p - 0.5) * (window.innerWidth * 0.72);
      const scale = 0.8 + Math.sin(p * Math.PI) * 0.35;
      const swayY = Math.sin(p * Math.PI * 4) * 22;
      if (boatRef.current) {
        boatRef.current.style.transform =
          `translate3d(${travel}px, ${swayY}px, 0) scale(${scale})`;
      }

      // parallax water layers at different speeds
      const speeds = [600, 1200, 2000];
      waterRefs.forEach((ref, i) => {
        if (ref.current) ref.current.style.transform = `translate3d(${-p * speeds[i]}px, 0, 0)`;
      });

      // one place label per scroll segment (slides in, then out)
      const raw = p * PLACES.length;
      const idx = Math.floor(raw);
      const within = raw - idx;
      setSegment(idx < PLACES.length && within > 0.18 && within < 0.82 ? idx : -1);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="bd-journey" ref={sectionRef}>
      <div className="bd-journey-sticky">
        <div className="bd-journey-title">
          <h2 className="bd-title" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.6rem)" }}>
            Our Little Voyage
          </h2>
        </div>
        <div className="bd-moon-small" />

        {/* boat: outer = scroll transform, inner = continuous sailing physics */}
        <div className="bd-boat-outer" ref={boatRef}>
          <div className="bd-boat-inner">
            <img src="/boat.png" alt="Sailing boat" />
          </div>
        </div>

        <div className="bd-water l1" ref={waterRefs[0]}><span /></div>
        <div className="bd-water l2" ref={waterRefs[1]}><span /></div>
        <div className="bd-water l3" ref={waterRefs[2]}><span /></div>

        {PLACES.map((place, i) => (
          <div className={`bd-glass bd-place${segment === i ? " in" : ""}`} key={place.text}>
            <span className="icon">{place.icon}</span>
            <span className="text">{place.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
