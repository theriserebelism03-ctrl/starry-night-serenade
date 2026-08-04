import { useCallback, useEffect, useRef, useState } from "react";
import violinImg from "@/assets/violin.png.asset.json";

/** key -> { note label, frequency } */
const KEYS = {
  g: { note: "E4", freq: 329.63 },
  h: { note: "F4", freq: 349.23 },
  j: { note: "G4", freq: 392.0 },
  k: { note: "A4", freq: 440.0 },
  l: { note: "B4", freq: 493.88 },
  q: { note: "C5", freq: 523.25 },
  w: { note: "D5", freq: 587.33 },
  e: { note: "E5", freq: 659.25 },
  r: { note: "F5", freq: 698.46 },
  t: { note: "G5", freq: 783.99 },
  y: { note: "A5", freq: 880.0 },
  u: { note: "B5", freq: 987.77 },
  i: { note: "C6", freq: 1046.5 },
  o: { note: "D6", freq: 1174.66 },
  p: { note: "E6", freq: 1318.51 },
  z: { note: "F6", freq: 1396.91 },
  x: { note: "G6", freq: 1567.98 },
  c: { note: "A6", freq: 1760.0 },
  v: { note: "B6", freq: 1975.53 },
  b: { note: "C7", freq: 2093.0 },
  n: { note: "D7", freq: 2349.32 },
  m: { note: "E7", freq: 2637.02 },
};

const fmtTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/** Dedicated violin instrument screen. Sound only plays while a key is held. */
export default function ViolinStage({ onExit }) {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const streamDestRef = useRef(null);
  const voicesRef = useRef({});
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const playbackRef = useRef(null);

  const [active, setActive] = useState({});
  const [recording, setRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!recording) return;
    setElapsed(0);
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      const dest = ctx.createMediaStreamDestination ? ctx.createMediaStreamDestination() : null;
      if (dest) master.connect(dest);
      ctxRef.current = ctx;
      masterRef.current = master;
      streamDestRef.current = dest;
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const noteOn = useCallback(
    (key) => {
      const spec = KEYS[key];
      if (!spec || voicesRef.current[key]) return;
      const ctx = getCtx();
      const t = ctx.currentTime;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.22, t + 0.12); // slow bowed attack

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2600;

      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.value = 5.2;
      vibratoGain.gain.value = spec.freq * 0.006;
      vibrato.connect(vibratoGain);

      const oscs = [
        { type: "sawtooth", detune: 0, level: 0.6 },
        { type: "triangle", detune: 6, level: 0.3 },
        { type: "sine", detune: -6, level: 0.25 },
      ].map((cfg) => {
        const osc = ctx.createOscillator();
        osc.type = cfg.type;
        osc.frequency.value = spec.freq;
        osc.detune.value = cfg.detune;
        const g = ctx.createGain();
        g.gain.value = cfg.level;
        vibratoGain.connect(osc.frequency);
        osc.connect(g).connect(filter);
        osc.start();
        return osc;
      });

      filter.connect(gain).connect(masterRef.current);
      vibrato.start();

      voicesRef.current[key] = { oscs, vibrato, gain };
      setActive((a) => ({ ...a, [key]: true }));
    },
    [getCtx],
  );

  const noteOff = useCallback((key) => {
    const voice = voicesRef.current[key];
    if (!voice) return;
    delete voicesRef.current[key];
    const ctx = ctxRef.current;
    const t = ctx.currentTime;
    voice.gain.gain.cancelScheduledValues(t);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), t);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    voice.oscs.forEach((o) => o.stop(t + 0.22));
    voice.vibrato.stop(t + 0.22);
    setActive((a) => ({ ...a, [key]: false }));
  }, []);

  // keyboard hold handling
  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase();
      if (KEYS[k] && !e.repeat) {
        e.preventDefault();
        noteOn(k);
      }
      if (e.key === "Escape") onExit();
    };
    const up = (e) => {
      const k = e.key.toLowerCase();
      if (KEYS[k]) noteOff(k);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", () => Object.keys(voicesRef.current).forEach(noteOff));
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [noteOn, noteOff, onExit]);

  // cleanup
  useEffect(
    () => () => {
      Object.keys(voicesRef.current).forEach((k) => {
        const v = voicesRef.current[k];
        v.oscs.forEach((o) => { try { o.stop(); } catch { /* noop */ } });
        try { v.vibrato.stop(); } catch { /* noop */ }
      });
      voicesRef.current = {};
      if (recorderRef.current && recorderRef.current.state === "recording") recorderRef.current.stop();
      if (ctxRef.current) ctxRef.current.close();
    },
    [],
  );

  const toggleRecording = () => {
    if (recording) {
      recorderRef.current && recorderRef.current.stop();
      return;
    }
    getCtx();
    const dest = streamDestRef.current;
    if (!dest || typeof MediaRecorder === "undefined") return;
    chunksRef.current = [];
    const rec = new MediaRecorder(dest.stream);
    rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
      setRecordingUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setRecording(false);
    };
    recorderRef.current = rec;
    rec.start();
    setRecording(true);
  };

  const playRecording = () => {
    if (!recordingUrl) return;
    if (!playbackRef.current) playbackRef.current = new Audio();
    playbackRef.current.src = recordingUrl;
    playbackRef.current.currentTime = 0;
    playbackRef.current.play();
  };

  return (
    <div className="bd-violin-page" onMouseMove={onStageMove} onMouseLeave={() => setBow((b) => ({ ...b, on: false }))}>
      <button type="button" className="bd-btn bd-violin-exit" onClick={onExit}>
        ← Exit
      </button>

      <h2 className="bd-title bd-violin-title">Play the Violin</h2>
      <p className="bd-sub">hold A · S · D · F to bow the strings</p>

      <div className="bd-violin-stage">
        <img className={`bd-violin-img${Object.values(active).some(Boolean) ? " bowing" : ""}`} src={violinImg.url} alt="Violin" />
        <div
          className={`bd-bow${bow.on ? " on" : ""}`}
          style={{ left: `${bow.x}%`, top: `${bow.y}%` }}
          aria-hidden="true"
        >
          <span className="bd-bow-stick" />
          <span className="bd-bow-hair" />
        </div>
      </div>

      <div className="bd-violin-keys">
        {Object.entries(KEYS).map(([k, spec]) => (
          <button
            key={k}
            type="button"
            className={`bd-violin-key${active[k] ? " on" : ""}`}
            onMouseDown={() => noteOn(k)}
            onMouseUp={() => noteOff(k)}
            onMouseLeave={() => noteOff(k)}
            onTouchStart={(e) => { e.preventDefault(); noteOn(k); }}
            onTouchEnd={(e) => { e.preventDefault(); noteOff(k); }}
          >
            <strong>{k.toUpperCase()}</strong>
            <span>{spec.note}</span>
          </button>
        ))}
      </div>

      <div className="bd-rec-bar bd-glass">
        <button type="button" className={`bd-btn bd-rec-btn${recording ? " rec" : ""}`} onClick={toggleRecording}>
          {recording && <span className="bd-rec-dot" />}
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
        <button type="button" className="bd-btn" onClick={playRecording} disabled={!recordingUrl || recording}>
          Play Recording
        </button>
      </div>
    </div>
  );
}
