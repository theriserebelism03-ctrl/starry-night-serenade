import { useCallback, useEffect, useRef, useState } from "react";
import { createMelodyPlayer, MELODY_A, MELODY_B } from "../lib/synth.js";
import kalyaniAudio from "../assets/kalyani.mp3.asset.json";

/** Track list — mp3 files live in /public (add your own to override the synth). */
const TRACKS = [
  { id: 0, name: "Kalyani", src: kalyaniAudio.url, melody: MELODY_A, loop: true },
  { id: 1, name: "Until I Found You", src: "/song2.mp3", melody: MELODY_B },
];

/**
 * Scene 2 — gramophone jukebox.
 * Two vinyl discs; clicking one plays that track, clicking the other switches
 * cleanly. When track 1 ends untouched, track 2 starts immediately (no gap).
 * No timers / durations are displayed anywhere.
 */
export default function Gramophone({ onContinue, audioRef }) {
  const [current, setCurrent] = useState(null);
  const [chosen, setChosen] = useState(false);
  const fallbackRef = useRef(null);

  const stopFallback = () => {
    if (fallbackRef.current) {
      fallbackRef.current.stop();
      fallbackRef.current = null;
    }
  };

  const playFallback = useCallback(
    (index) => {
      stopFallback();
      const player = createMelodyPlayer(TRACKS[index].melody);
      fallbackRef.current = player;
      player.start(() => {
        // auto-chain into the next track with no pause
        const next = (index + 1) % TRACKS.length;
        if (next !== index) {
          setCurrent(next);
          playFallback(next);
        }
      });
    },
    [],
  );

  const play = useCallback(
    (index) => {
      setCurrent(index);
      setChosen(true);
      const audio = audioRef.current;
      stopFallback();
      if (!audio) return;
      audio.src = TRACKS[index].src;
      audio.loop = Boolean(TRACKS[index].loop);
      audio.currentTime = 0;
      const attempt = audio.play();
      if (attempt && attempt.catch) {
        attempt.catch(() => playFallback(index)); // missing/blocked file → synth
      }
    },
    [audioRef, playFallback],
  );

  // auto-chain for the real <audio> element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      if (current === null) return;
      if (TRACKS[current].loop) return;
      const next = (current + 1) % TRACKS.length;
      if (next !== current) play(next);
    };
    const onError = () => {
      if (current !== null && audio.src) playFallback(current);
    };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [audioRef, current, play, playFallback]);

  // stop the synth fallback when the scene unmounts
  useEffect(() => stopFallback, []);

  return (
    <section className="bd-scene">
      <h2 className="bd-title">A Song For You</h2>
      <p className="bd-sub">choose a record</p>

      <img
        className={`bd-gramo${current !== null ? " playing" : ""}`}
        src="/gramophone.png"
        alt="Antique gramophone"
      />

      <div className="bd-discs">
        {TRACKS.map((track, i) => (
          <div className="bd-disc-wrap" key={track.id}>
            <button
              type="button"
              aria-label={`Play ${track.name}`}
              className={`bd-disc${current === i ? " spinning" : ""}`}
              onClick={() => play(i)}
            />
            <span className={`bd-disc-label${current === i ? " active" : ""}`}>
              {track.name}
            </span>
          </div>
        ))}
      </div>

      {chosen && (
        <button type="button" className="bd-btn bd-fade-in" style={{ marginTop: "2.6rem" }} onClick={onContinue}>
          Continue the journey →
        </button>
      )}
    </section>
  );
}
