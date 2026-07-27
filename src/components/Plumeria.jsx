import plumeriaAsset from "@/assets/plumeria.png.asset.json";

/** Decorative plumeria blossom clusters. */
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
      <img src={plumeriaAsset.url} alt="" loading="lazy" width={1024} height={1024} />
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