import { useState } from "react";
import kittyAsset from "@/assets/kitty-orig-cut.png.asset.json";
import catAsset from "@/assets/cat-cut.png.asset.json";

/** Scene 5 — kitty walks in with a bouquet; click to read the letter. */
export default function KittyScene() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bd-scene">
      <h2 className="bd-title">Someone Has Something For You</h2>
      <p className="bd-sub">tap her to open the letter</p>

      <div className="bd-walker-pair">
        <div className="bd-walker" onClick={() => setOpen(true)} role="button" tabIndex={0}
             onKeyDown={(e) => e.key === "Enter" && setOpen(true)}>
          <div className="bd-walker-bounce">
            <img className="bd-sprite" src={kittyAsset.url} alt="Hello Kitty holding a bouquet" />
          </div>
        </div>
        <div className="bd-walker from-right" onClick={() => setOpen(true)} role="button" tabIndex={0}
             onKeyDown={(e) => e.key === "Enter" && setOpen(true)}>
          <div className="bd-walker-bounce" style={{ animationDelay: "0.35s" }}>
            <img className="bd-sprite" src={catAsset.url} alt="Pixel cat holding a rose" />
          </div>
        </div>
      </div>
      <button type="button" className="bd-btn" style={{ marginTop: "1.2rem" }} onClick={() => setOpen(true)}>
        Click me
      </button>

      {open && (
        <div className="bd-overlay" onClick={() => setOpen(false)}>
          <div className="bd-letter" onClick={(e) => e.stopPropagation()}>
            <h3 className="cursive">My dearest Rukmani,</h3>
            <p className="cursive">
              Happy birthday. Every good thing in my days seems to begin with you —
              the quiet mornings, the silly laughs, the long nights of talking about
              nothing at all. Thank you for being the kindest part of my world.
              <br />
              <br />
              Here&apos;s to another year of us, sailing wherever the water takes us.
            </p>
            <p className="cursive" style={{ textAlign: "right" }}>— always yours ❤️</p>
            <button type="button" className="bd-close" onClick={() => setOpen(false)}>
              Close Letter
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
