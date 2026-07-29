import { useEffect, useRef, useState } from "react";
import profileAsset from "../assets/profile.png.asset.json";
import Plumeria from "./Plumeria.jsx";

const PASSWORD = "2808";
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

/** Scene 1 — password lock screen. */
export default function LockScreen({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const audioCtxRef = useRef(null);

  /** Short synthesized error tone (Web Audio API — no sound files). */
  const playErrorTone = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = audioCtxRef.current || (audioCtxRef.current = new Ctx());
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.32);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      /* audio is decorative — ignore failures */
    }
  };

  const press = (k) => {
    if (k === "del") {
      setValue((v) => v.slice(0, -1));
      return;
    }
    if (!k) return;
    setValue((v) => (v.length >= 4 ? v : v + k));
  };

  useEffect(() => {
    if (value.length < 4) return;
    if (value === PASSWORD) {
      onUnlock();
      return;
    }
    setError(true);
    playErrorTone();
    const t = window.setTimeout(() => {
      setError(false);
      setValue("");
    }, 700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <section className="bd-scene" onClick={() => setRevealed(true)}>
      <Plumeria corner="tr" />
      <Plumeria corner="bl" />
      <div className={`bd-lock-card bd-fade-in${error ? " shake" : ""}`}>
        <button
          type="button"
          className="bd-avatar-btn"
          onClick={() => setRevealed(true)}
          aria-label="Reveal passcode pad"
        >
          <img className="bd-avatar" src={profileAsset.url} alt="Portrait" />
        </button>

        {!revealed && <p className="bd-sub bd-tap-hint">Tap to unlock</p>}

        <div className={`bd-pad-wrap${revealed ? " open" : ""}`} aria-hidden={!revealed}>
          <p className="bd-sub" style={{ margin: "0 0 1rem" }}>
            for someone very special
          </p>

          <div className={`bd-dots${error ? " error" : ""}`} role="status" aria-label="Passcode">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={value.length > i ? "filled" : ""} />
            ))}
          </div>

          <div className="bd-dialpad">
            {KEYS.map((k, i) =>
              k === "" ? (
                <span key={i} />
              ) : (
                <button
                  key={i}
                  type="button"
                  className={`bd-key${k === "del" ? " ghost" : ""}`}
                  onClick={() => press(k)}
                  tabIndex={revealed ? 0 : -1}
                  aria-label={k === "del" ? "Delete" : k}
                >
                  {k === "del" ? "⌫" : k}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            className="bd-link"
            tabIndex={revealed ? 0 : -1}
            onClick={() => setShowHint(true)}
          >
            Forgot Password?
          </button>
          {showHint && <p className="bd-hint">Password : 2808 ❤️</p>}
        </div>
      </div>
    </section>
  );
}
