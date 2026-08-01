import { useState } from "react";
import lid1 from "@/assets/gift1-lid.png.asset.json";
import base1 from "@/assets/gift1-base.png.asset.json";
import lid2 from "@/assets/gift2-lid.png.asset.json";
import base2 from "@/assets/gift2-base.png.asset.json";
import lid3 from "@/assets/gift3-lid.png.asset.json";
import base3 from "@/assets/gift3-base.png.asset.json";
import veilComic from "@/assets/veil-comic.jpg.asset.json";

const GIFTS = [
  { id: 1, lid: lid1.url, base: base1.url },
  { id: 2, lid: lid2.url, base: base2.url },
  { id: 3, lid: lid3.url, base: base3.url },
];

/** Scene 6 — three gift boxes that open and close on tap. */
export default function GiftBoxes() {
  const [open, setOpen] = useState({});

  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  const close = (id) => setOpen((o) => ({ ...o, [id]: false }));

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

            {g.id === 1 && (
              <div className="bd-gift-reveal">
                <img className="bd-gift-comic" src={veilComic.url} alt="Veil comic cover" />
                <a
                  className="bd-gift-link"
                  href="https://comix.to/title/k7lny-veil"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read / View Veil Comic
                </a>
                <button
                  className="bd-gift-close"
                  onClick={(e) => { e.stopPropagation(); close(g.id); }}
                  aria-label="Close box"
                >
                  Close Box
                </button>
              </div>
            )}

            <img className="bd-gift-base" src={g.base} alt="" />
            <img className="bd-gift-lid" src={g.lid} alt="" />
          </div>
        ))}
      </div>
      <p className="bd-sub" style={{ marginTop: "2rem" }}>tap a box to open it</p>
    </section>
  );
}
