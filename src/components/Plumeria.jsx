/**
 * Pure-CSS plumeria (frangipani) blossoms — no images.
 * Rendered as decorative corner clusters.
 */
function Bloom({ size = 120, rotate = 0, delay = 0, left = 0, top = 0 }) {
  return (
    <div
      className="bd-bloom"
      style={{
        "--sz": `${size}px`,
        "--rot": `${rotate}deg`,
        animationDelay: `${delay}s`,
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="bd-petal" style={{ "--i": i }} />
      ))}
      <span className="bd-bloom-core" />
    </div>
  );
}

export default function Plumeria({ corner = "tr" }) {
  return (
    <div className={`bd-flowers bd-flowers-${corner}`} aria-hidden="true">
      <Bloom size={130} rotate={-12} delay={0} left={40} top={10} />
      <Bloom size={96} rotate={24} delay={0.9} left={140} top={78} />
      <Bloom size={72} rotate={-40} delay={1.7} left={12} top={112} />
    </div>
  );
}