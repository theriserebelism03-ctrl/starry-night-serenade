import { useEffect, useRef } from "react";

const PHOTOS = [
  "First Hello", "Rainy Walk", "Coffee & You", "Golden Hour", "That Concert",
  "Sunday Morning", "Beach Day", "Late Night Talks", "Our Song", "Forever",
];

/** Scene 3 — polaroid grid revealed with IntersectionObserver (staggered). */
export default function MemoryGallery() {
  const gridRef = useRef(null);

  useEffect(() => {
    const cards = gridRef.current ? Array.from(gridRef.current.children) : [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = cards.indexOf(entry.target);
          // stagger each card slightly
          window.setTimeout(() => entry.target.classList.add("visible"), index % 4 * 130);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bd-scene" style={{ minHeight: "auto", paddingTop: "12vh", paddingBottom: "12vh" }}>
      <h2 className="bd-title">Our Memories</h2>
      <p className="bd-sub">scroll slowly, they&apos;re worth it</p>

      <div className="bd-gallery" ref={gridRef}>
        {PHOTOS.map((caption, i) => (
          <figure
            className="bd-polaroid"
            key={caption}
            style={{ "--tilt": `${(i % 3) - 1}deg` }}
          >
            <img className="bd-photo" src={`/photo${i + 1}.png`} alt={caption} loading="lazy" />
            <figcaption className="bd-caption">{caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
