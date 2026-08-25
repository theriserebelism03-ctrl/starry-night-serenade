import { useState } from "react";
import kittyAsset from "@/assets/kitty-orig-cut.png.asset.json";
import catAsset from "@/assets/cat-rose-cut.png.asset.json";

/** Scene 5 — kitty walks in with a bouquet; click to read the letter. */
export default function KittyScene() {
  const [open, setOpen] = useState(false);
  const [kittyGone, setKittyGone] = useState(false);

  const openFromKitty = () => {
    setKittyGone(true);
    setOpen(true);
  };

  return (
    <section className="bd-scene">
      <h2 className="bd-title">Someone Has Something For You</h2>
      <p className="bd-sub">tap her to open the letter</p>

      <div className="bd-walker-pair">
        {!kittyGone && (
          <div className="bd-walker-col">
            <div
              className="bd-walker"
              onClick={openFromKitty}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openFromKitty()}
            >
              <div className="bd-walker-bounce">
                <img
                  className="bd-sprite"
                  src={kittyAsset.url}
                  alt="Hello Kitty holding a bouquet"
                />
              </div>
            </div>
            <button type="button" className="bd-btn" onClick={openFromKitty}>
              Click me
            </button>
          </div>
        )}
        <div className="bd-walker-col">
          <div
            className="bd-walker from-right"
            onClick={() => setOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
          >
            <div className="bd-walker-bounce" style={{ animationDelay: "0.35s" }}>
              <img className="bd-sprite" src={catAsset.url} alt="Pixel cat holding a rose" />
            </div>
          </div>
          <button type="button" className="bd-btn" onClick={() => setOpen(true)}>
            Click me
          </button>
        </div>
      </div>

      {open && (
        <div className="bd-overlay" onClick={() => setOpen(false)}>
          <div className="bd-letter" onClick={(e) => e.stopPropagation()}>
            <h3 className="cursive">My dearest Rukmani,</h3>
            <p className="cursive">
              Happy Birthday to who means more to me than I could ever properly put into words.
              <br />
              <br />
              I honestly don't know how to explain what you are to me, because calling you just a
              “best friend” somehow feels too small. You have become such an important part of my
              life that I can't imagine my days without your presence, your conversations, your
              craziness, your support, and even those little moments where we do absolutely nothing
              but still somehow make memories.
              <br />
              <br />
              You came into my life as a friend, but somewhere along the way, you became someone I
              genuinely can't afford to lose. You are one of those rare people who make life feel a
              little lighter just by being there. I may not always say it, and I may not always know
              how to show it, but I care about you more than you probably realize.
              <br />
              <br />
              I don't always know how to express emotions properly. Sometimes I joke around,
              sometimes I annoy you, sometimes I act like I don't care, but behind all of that is
              someone who is genuinely grateful that you exist in his life. Your happiness matters
              to me. Your tears matter to me. Your dreams matter to me. And no matter where life
              takes us, I will always want to see you doing well, smiling genuinely, and becoming
              the person you dream of being.
              <br />
              <br />
              We've shared so many moments together, and I hope we get to create many more. There
              will be days when life gets busy, people change, and everything around us feels
              different. But I sincerely hope that no matter how much life changes, the bond we have
              never becomes just a memory.
              <br />
              <br />
              On our birthday, I don't just wish you happiness for today. I wish you a life where
              you never have to question your worth, where you are surrounded by people who truly
              value you, where your dreams slowly become reality, and where you always have a reason
              to smile.
              <br />
              <br />
              Thank you for being the person you are. Thank you for being my best friend. Thank you
              for staying through the good days and the difficult ones. And thank you for becoming
              such an unforgettable part of my life.
              <br />
              <br />
              I may never be able to explain exactly how important you are to me, but I hope you
              always remember this:
              <br />
              <br />
              You are not just someone I know. You are someone I deeply care about, someone I
              genuinely treasure, and someone I never want to lose.
              <br />
              <br />
              Happy Birthday, my cat women.
              <br />
              <br />
              May this year bring you everything your heart deserves. And wherever life takes us, I
              hope a small part of our friendship always stays exactly the way it is today.
              <br />
              <br />
              You will always have a special place in my life that nobody else can replace.
            </p>
            <p className="cursive" style={{ textAlign: "right" }}>
              — always yours ❤️
            </p>
            <button type="button" className="bd-close" onClick={() => setOpen(false)}>
              Close Letter
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
