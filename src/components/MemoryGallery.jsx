import { useEffect, useRef, useState } from "react";

const PHOTOS = [
  { caption: "First Hello", file: "photo1.png" },
  { caption: "Rainy Walk", file: "photo2.png" },
  { caption: "Coffee & You", file: "photo3.png" },
  { caption: "Golden Hour", file: "photo4.png" },
  { caption: "That Concert", file: "photo5.png" },
  { caption: "Sunday Morning", file: "photo6.png" },
  { caption: "Beach Day", file: "photo7.png" },
  { caption: "Late Night Talks", file: "photo8.png" },
  { caption: "Our Song", file: "photo9.png" },
  { caption: "Forever", file: "photo10.png" },
];

/**
 * Scene 3 — vertical scroll-driven polaroid slideshow.
 * One polaroid is visible at a time; scroll down to reveal the next frame.
 */
export default function MemoryGallery() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;
      const el = sectionRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / (total || 1)));
      const idx = Math.min(PHOTOS.length - 1, Math.floor(p * PHOTOS.length));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
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
    <section className="bd-gallery-journey" ref={sectionRef}>
      <div className="bd-gallery-sticky">
        <h2 className="bd-title">Our Memories</h2>
        <p className="bd-sub">scroll down to see them one by one</p>

        <div className="bd-polaroid-stage">
          {PHOTOS.map((photo, i) => (
            <figure
              className={`bd-polaroid${active === i ? " active" : ""}`}
              key={photo.caption}
              style={{ "--tilt": `${(i % 3) - 1}deg`, "--i": i }}
            >
              <img
                className="bd-photo"
                src={`/${photo.file}`}
                alt={photo.caption}
                loading="lazy"
              />
              <figcaption className="bd-caption">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>

        <div className="bd-gallery-dots">
          {PHOTOS.map((_, i) => (
            <span key={i} className={active === i ? "active" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
