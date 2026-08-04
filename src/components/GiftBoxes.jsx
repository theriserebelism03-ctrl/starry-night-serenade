import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import lid1 from "@/assets/gift1-lid.png.asset.json";
import base1 from "@/assets/gift1-base.png.asset.json";
import lid2 from "@/assets/gift2-lid.png.asset.json";
import base2 from "@/assets/gift2-base.png.asset.json";
import lid3 from "@/assets/gift3-lid.png.asset.json";
import base3 from "@/assets/gift3-base.png.asset.json";
import veilComic from "@/assets/veil-comic.jpg.asset.json";
import ViolinStage from "./ViolinStage.jsx";

const GIFTS = [
  { id: 1, lid: lid1.url, base: base1.url },
  { id: 2, lid: lid2.url, base: base2.url },
  { id: 3, lid: lid3.url, base: base3.url },
];

/** Scene 6 — three gift boxes that open and close on tap. */
export default function GiftBoxes({ audioRef }) {
  const [open, setOpen] = useState({});
  const [violin, setViolin] = useState(false);
  const wasPlayingRef = useState({ current: false })[0];

  const openViolin = () => {
    const audio = audioRef && audioRef.current;
    if (audio && !audio.paused) {
      wasPlayingRef.current = true;
      audio.pause();
    }
    setViolin(true);
  };

  const exitViolin = () => {
    setViolin(false);
    const audio = audioRef && audioRef.current;
    if (audio && wasPlayingRef.current) {
      wasPlayingRef.current = false;
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    }
  };

  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  const close = (id) => setOpen((o) => ({ ...o, [id]: false }));

  const modalOpen = Boolean(open[1]);

  useEffect(() => {
    if (!modalOpen && !violin) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape" && modalOpen) close(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen, violin]);

  return (
    <section className="bd-scene bd-gifts-scene">
      <div className="bd-gifts-gap" aria-hidden="true" />
      <h2 className="bd-title bd-gifts-text">wait i have another things for you rey!!!</h2>

      <div className="bd-gift-row">
        {GIFTS.map((g, i) => (
          <div
            key={g.id}
            className={`bd-gift${open[g.id] ? " open" : ""}`}
            style={{ animationDelay: `${i * 0.12}s` }}
            role="button"
            tabIndex={0}
            aria-label={open[g.id] ? "Close gift box" : "Open gift box"}
            onClick={() => toggle(g.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggle(g.id)}
          >
            <div className="bd-gift-inner" />

            <img className="bd-gift-base" src={g.base} alt="" />
            <img className="bd-gift-lid" src={g.lid} alt="" />
          </div>
        ))}
      </div>
      <p className="bd-sub" style={{ marginTop: "2rem" }}>tap a box to open it</p>

      {open[2] && (
        <button
          type="button"
          className="bd-btn bd-fade-in"
          style={{ marginTop: "1.4rem" }}
          onClick={openViolin}
        >
          🎻 Play Violin
        </button>
      )}

      {violin && typeof document !== "undefined" &&
        createPortal(<ViolinStage onExit={exitViolin} />, document.body)}

      {modalOpen && typeof document !== "undefined" && createPortal(
        <div
          className="bd-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Veil comic"
          onClick={() => close(1)}
        >
          <div className="bd-glass bd-veil-modal" onClick={(e) => e.stopPropagation()}>
            <img className="bd-veil-cover" src={veilComic.url} alt="Veil comic cover" />
            <a
              className="bd-btn bd-veil-cta"
              href="https://comix.to/title/k7lny-veil"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read / View Veil Comic
            </a>
            <button className="bd-gift-close" onClick={() => close(1)} aria-label="Close box">
              Close Box
            </button>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
