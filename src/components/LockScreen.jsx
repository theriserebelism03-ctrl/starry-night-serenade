import { useRef, useState } from "react";

const PASSWORD = "2808";

/** Scene 1 — password lock screen. */
export default function LockScreen({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
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

  const submit = (e) => {
    e.preventDefault();
    if (value === PASSWORD) {
      onUnlock();
      return;
    }
    setError(true);
    playErrorTone();
    window.setTimeout(() => setError(false), 700);
  };

  return (
    <section className="bd-scene">
      <form
        onSubmit={submit}
        className={`bd-glass bd-lock-card bd-fade-in${error ? " shake" : ""}`}
      >
        <img className="bd-avatar" src="/profile.png" alt="Portrait" />
        <h1 className="bd-title" style={{ fontSize: "2rem" }}>
          Enter Password
        </h1>
        <p className="bd-sub" style={{ margin: 0 }}>
          for someone very special
        </p>

        <input
          className={`bd-pin${error ? " error" : ""}`}
          inputMode="numeric"
          maxLength={4}
          placeholder="••••"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
          aria-label="4 digit password"
        />

        <button type="submit" className="bd-btn">
          Unlock
        </button>

        <button type="button" className="bd-link" onClick={() => setShowHint(true)}>
          Forgot Password?
        </button>
        {showHint && <p className="bd-hint">Password : 2808 ❤️</p>}
      </form>
    </section>
  );
}
