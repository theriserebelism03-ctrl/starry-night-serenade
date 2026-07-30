import { useCallback, useRef, useState } from "react";
import "./App.css";

import StarField from "./components/StarField.jsx";
import ButterflyCursor from "./components/ButterflyCursor.jsx";
import LockScreen from "./components/LockScreen.jsx";
import Gramophone from "./components/Gramophone.jsx";
import MemoryGallery from "./components/MemoryGallery.jsx";
import BoatJourney from "./components/BoatJourney.jsx";
import KittyScene from "./components/KittyScene.jsx";
import FinalScene from "./components/FinalScene.jsx";

/**
 * Scene state machine:
 *  "lock"    → scene 1
 *  "music"   → scene 2
 *  "journey" → scenes 3-7 (one continuous scroll)
 */
export default function App() {
  const [scene, setScene] = useState("lock");
  const [curtain, setCurtain] = useState(false);
  const [key, setKey] = useState(0); // bumping this resets every child's state
  const audioRef = useRef(null);

  /** Fade to black, run the change, fade back in. */
  const transition = useCallback((change) => {
    setCurtain(true);
    window.setTimeout(() => {
      change();
      window.scrollTo(0, 0);
      window.setTimeout(() => setCurtain(false), 120);
    }, 900);
  }, []);

  const stopAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
  };

  const handleExit = () =>
    transition(() => {
      stopAudio();
      setScene("lock");
      setKey((k) => k + 1); // full reset, ready to replay
    });

  return (
    <div className="bd-root" key={key}>
      <StarField />
      <ButterflyCursor />
      <audio ref={audioRef} preload="none" />

      {scene === "lock" && <LockScreen onUnlock={() => transition(() => setScene("music"))} />}

      {scene === "music" && (
        <Gramophone audioRef={audioRef} onContinue={() => transition(() => setScene("journey"))} />
      )}

      {scene === "journey" && (
        <>
          <MemoryGallery />
          <BoatJourney />
          <KittyScene />
          <FinalScene onExit={handleExit} />
        </>
      )}

      <div className={`bd-curtain${curtain ? " on" : ""}`} />
    </div>
  );
}
