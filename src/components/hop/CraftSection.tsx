import fabricImg from "@/assets/hop-fabric.jpg";
import pattuImg from "@/assets/hop-collection-pattu.jpg";
import organzaImg from "@/assets/hop-collection-organza.jpg";

export const CraftSection = () => (
  <section className="bg-sand/30">
    <div className="container py-20 sm:py-28 lg:py-32">
      <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
        <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-teal mb-4">The Craft</p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight text-balance">
          Sixty per cent jasmine, twenty-five teal, ten gold, five blush.
        </h2>
        <p className="mt-6 text-sm sm:text-base text-ink-soft font-light leading-relaxed">
          Every Padmavati weave is calibrated to the Coastal Blossom ratio before a single thread meets the loom.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
        {[
          { tag: "The Loom", title: "Hand-woven on Pointcarre CAD looms in coastal Tamil Nadu.", img: fabricImg },
          { tag: "The Thread", title: "Mulberry silk and pure zari, sourced one village at a time.", img: pattuImg },
          { tag: "The Hand", title: "Sixty hours per drape. No shortcuts, no power-loom imitations.", img: organzaImg },
        ].map((b, i) => (
          <div key={b.tag} className={`space-y-5 ${i === 1 ? "lg:translate-y-12" : ""}`}>
            <div className="aspect-[4/5] overflow-hidden rounded-md bg-jasmine-deep">
              <img src={b.img} alt={b.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <p className="text-[0.6rem] tracking-[0.42em] uppercase text-teal">{b.tag}</p>
            <h3 className="font-serif text-xl sm:text-2xl leading-snug text-balance">{b.title}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);