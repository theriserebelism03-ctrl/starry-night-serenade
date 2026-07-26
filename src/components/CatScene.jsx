import { useState } from "react";

/** Scene 6 — cat walks in with a rose; clicking the rose blooms it. */
export default function CatScene() {
  const [bloomed, setBloomed] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRose = () => {
    setBloomed(true);
    window.setTimeout(() => setOpen(true), 700);
  };

  return (
    <section className="bd-scene">
      <h2 className="bd-title">And A Rose</h2>
      <p className="bd-sub">tap the rose</p>

      <div className="bd-walker from-right" style={{ position: "relative" }}>
        <div className="bd-walker-bounce">
          <img src="/cat.png" alt="Grey cat" style={{ width: "100%", display: "block" }} />
        </div>
      </div>

      <button
        type="button"
        aria-label="Bloom the rose"
        className={`bd-rose${bloomed ? " bloom" : ""}`}
        style={{ background: "none", border: "none", marginTop: "1.6rem" }}
        onClick={handleRose}
      >
        🌹
      </button>

      {open && (
        <div className="bd-overlay" onClick={() => setOpen(false)}>
          <div className="bd-glass bd-info" onClick={(e) => e.stopPropagation()}>
            <h3 className="bd-title" style={{ fontSize: "1.8rem" }}>About Rukmani</h3>
            <p style={{ lineHeight: 1.9, color: "rgba(255,255,255,0.85)" }}>
              Placeholder text — add her story here. Her favourite things, the way
              she laughs at her own jokes, the songs she hums, and every small
              detail worth remembering.
            </p>
            <button type="button" className="bd-btn" style={{ marginTop: "1.4rem" }} onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
