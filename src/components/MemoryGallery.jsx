import { useEffect, useRef, useState } from "react";

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
              key={photo.url}
              style={{ "--tilt": `${(i % 3) - 1}deg`, "--i": i }}
            >
              <img className="bd-photo" src={photo.url} alt="" loading="lazy" />
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
