/** Scene 7 — thank you + exit (resets the whole experience). */
export default function FinalScene({ onExit }) {
  return (
    <section className="bd-scene">
      <div className="bd-moon" />
      <h2 className="bd-title">Thank You ❤️</h2>
      <p className="bd-sub">for every single memory</p>
      <button type="button" className="bd-btn" onClick={onExit}>
        Exit
      </button>
    </section>
  );
}
