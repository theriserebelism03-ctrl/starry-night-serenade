import { useEffect, useRef } from "react";

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
 * Scene 3 — horizontal scroll-driven polaroid slideshow.
 * Scroll sideways to scrub through the frames like a film strip.
 * Each polaroid fades/scales in as it enters the viewport.
 */
export default function MemoryGallery() {
  const trackRef = useRef(null);

  useEffect(() => {
    const cards = trackRef.current ? Array.from(trackRef.current.children) : [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cards.indexOf(entry.target);
          if (entry.isIntersecting) {
            window.setTimeout(() => entry.target.classList.add("visible"), (index % 5) * 90);
          } else if (entry.boundingClientRect.left > 0) {
            // reset only frames that are still off-screen to the right
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.55, root: trackRef.current },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bd-scene bd-gallery-scene">
      <h2 className="bd-title">Our Memories</h2>
      <p className="bd-sub">scroll sideways to reveal each moment</p>

      <div className="bd-gallery-track" ref={trackRef}>
        {PHOTOS.map((photo, i) => (
          <figure
            className="bd-polaroid"
            key={photo.caption}
            style={{ "--tilt": `${(i % 3) - 1}deg`, "--i": i }}
          >
            <img
              className="bd-photo"
              src={`/${photo.file}`}
              alt={photo.caption}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #0d2a5e, #071a3d 60%, #000)";
              }}
            />
            <figcaption className="bd-caption">{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
