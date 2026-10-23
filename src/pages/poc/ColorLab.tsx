import { useState } from "react";
import heroImg from "@/assets/hop-hero.jpg";
import pattuImg from "@/assets/hop-collection-pattu.jpg";
import linenImg from "@/assets/hop-collection-linen.jpg";
import organzaImg from "@/assets/hop-collection-organza.jpg";
import fabricImg from "@/assets/hop-fabric.jpg";
import giftImg from "@/assets/hop-gift.jpg";

type Palette = {
  id: string;
  name: string;
  desc: string;
  bg: string;
  bgDeep: string;
  ink: string;
  inkSoft: string;
  accent: string;
  accentHover: string;
  accentInk: string;
  material: string;
  material2: string;
  border: string;
  tagline: string;
};

const PALETTES: Palette[] = [
  {
    id: "A",
    name: "A - Off-White Register (committed default)",
    desc: "Warm off-white ground, charcoal ink, dusty-mauve action. Blush and warm neutrals stay in supporting roles.",
    bg: "#F8F5F2",
    bgDeep: "#FBF8F5",
    ink: "#2B2624",
    inkSoft: "#574F4C",
    accent: "#7E5C58",
    accentHover: "#6B4B47",
    accentInk: "#F8F5F2",
    material: "#B18B87",
    material2: "#E0C3C0",
    border: "#DDD5D0",
    tagline: "Warm Off-White · Charcoal · Dusty Mauve · Blush used sparingly",
  },
  {
    id: "B",
    name: "B - Charcoal Register (cinematic)",
    desc: "Charcoal ground for hero, collection films and the invitation. Off-white type, blush accents, mauve support.",
    bg: "#2B2624",
    bgDeep: "#3A3330",
    ink: "#F8F5F2",
    inkSoft: "#CFC5C0",
    accent: "#E0C3C0",
    accentHover: "#EFDFDD",
    accentInk: "#2B2624",
    material: "#B18B87",
    material2: "#C7A7A3",
    border: "#4E4541",
    tagline: "Charcoal · Warm Off-White · Muted Blush · Dusty Mauve",
  },
  {
    id: "C",
    name: "C - Dusty Mauve Register (ownership)",
    desc: "Dusty Mauve as a full editorial ground with charcoal type and one deeper-mauve rule. Used once per journey.",
    bg: "#B18B87",
    bgDeep: "#C7A7A3",
    ink: "#1E1A18",
    inkSoft: "#1E1A18",
    accent: "#7E5C58",
    accentHover: "#6B4B47",
    accentInk: "#F8F5F2",
    material: "#574F4C",
    material2: "#F8F5F2",
    border: "#C7A7A3",
    tagline: "Dusty Mauve · Charcoal · Deep Mauve · off-white rule",
  },
  {
    id: "D",
    name: "D - Blush Register (journal)",
    desc: "Muted Blush for journal and quiet editorial panels; raised off-white cards carry the reading.",
    bg: "#E0C3C0",
    bgDeep: "#F2EBE7",
    ink: "#2B2624",
    inkSoft: "#574F4C",
    accent: "#7E5C58",
    accentHover: "#6B4B47",
    accentInk: "#F8F5F2",
    material: "#B18B87",
    material2: "#C7A7A3",
    border: "#DDD5D0",
    tagline: "Muted Blush · Charcoal · Deep Mauve · warm neutral line",
  },
];

function PaletteCard({ p }: { p: Palette }) {
  const style: React.CSSProperties = {
    background: p.bg,
    color: p.ink,
    borderColor: p.border,
  };
  return (
    <section className="rounded-sm overflow-hidden border" style={style}>
      <div className="p-6 md:p-8">
        <p className="text-[0.6rem] tracking-[0.32em] uppercase" style={{ color: p.inkSoft }}>
          Palette {p.id} · {p.tagline}
        </p>
        <h2 className="mt-3 font-serif text-2xl md:text-3xl leading-tight" style={{ color: p.ink }}>
          {p.name}
        </h2>
        <p className="mt-3 text-sm font-light leading-relaxed max-w-2xl" style={{ color: p.inkSoft }}>
          {p.desc}
        </p>
        <div className="mt-6 flex gap-3">
          {[
            { c: p.bg, label: "Ground" },
            { c: p.bgDeep, label: "Ground+" },
            { c: p.ink, label: "Ink" },
            { c: p.accent, label: "Accent" },
            { c: p.material, label: "Material" },
            { c: p.material2, label: "Support" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full border shadow-sm" style={{ background: s.c, borderColor: p.border }} title={`${s.label} ${s.c}`} />
              <span className="text-[0.55rem] tracking-wide" style={{ color: p.inkSoft }}>
                {s.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-0 border-t" style={{ borderColor: p.border }}>
        {[pattuImg, fabricImg, giftImg, linenImg, organzaImg, heroImg].slice(0, 3).map((img, i) => (
          <div key={i} className="aspect-[4/5] overflow-hidden" style={{ background: p.bgDeep }}>
            <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-0 border-t" style={{ borderColor: p.border }}>
        <div className="p-6 space-y-3" style={{ background: p.bg }}>
          <p className="text-[0.6rem] tracking-[0.32em] uppercase" style={{ color: p.inkSoft }}>
            Editorial
          </p>
          <h3 className="font-serif text-xl leading-snug" style={{ color: p.ink }}>
            The zari catches the morning light.
          </h3>
          <p className="text-sm font-light leading-relaxed" style={{ color: p.inkSoft }}>
            Not the harsh noon light, but the soft light of early day, when everything is still possible. This is when a weave reveals itself.
          </p>
          <div className="flex gap-3 pt-2">
            <span className="px-4 py-2 rounded-full text-[0.65rem] tracking-[0.2em] uppercase" style={{ background: p.accent, color: p.accentInk }}>
              Add to bag
            </span>
            <span className="px-4 py-2 rounded-full text-[0.65rem] tracking-[0.2em] uppercase border" style={{ borderColor: p.ink + "33", color: p.ink }}>
              View detail
            </span>
          </div>
        </div>
        <div className="p-6 flex flex-col justify-center gap-4" style={{ background: p.bgDeep, borderLeft: `1px solid ${p.border}` }}>
          <div className="space-y-1">
            <p className="text-[0.6rem] tracking-[0.32em] uppercase" style={{ color: p.inkSoft }}>
              Product · Kalyani
            </p>
            <p className="font-serif text-lg" style={{ color: p.ink }}>
              Molakalmuru Temple Silk - ₹ 48,000
            </p>
            <p className="text-xs" style={{ color: p.inkSoft }}>
              Mulberry · 12 momme · temple border · Molakalmuru
            </p>
          </div>
          <div className="h-px" style={{ background: p.border }} />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.accent }} />
            <span className="text-xs" style={{ color: p.inkSoft }}>
              Action accent - saving, hover, editorial rule
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.material }} />
            <span className="text-xs" style={{ color: p.inkSoft }}>
              Material accent - price confidence, loom details
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 flex items-center justify-between border-t text-[0.6rem] tracking-wide" style={{ borderColor: p.border, color: p.inkSoft }}>
        <span>Text on ground: {(p.id === "B" ? "ink is light" : "ink is dark")} · AA check required after token lock</span>
        <span className="hidden sm:inline">Hover: {p.accentHover}</span>
      </div>
    </section>
  );
}

export default function ColorLab() {
  const [active, setActive] = useState<string>("all");
  const list = active === "all" ? PALETTES : PALETTES.filter((p) => p.id === active);
  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#2B2624]">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <p className="text-[0.65rem] tracking-[0.42em] uppercase text-[#574F4C]">HOP · Color Lab · staging only</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight">The same palette, four registers.</h1>
        <p className="mt-4 text-sm font-light leading-relaxed max-w-2xl text-[#574F4C]">
          Same imagery, same type, same copy - only palette changes. Compare how each ground treats silk sheen, zari warmth, skin, and ink typography. No palette is committed; this is evidence.
        </p>
        <div className="mt-6 flex gap-2 flex-wrap">
          <button onClick={() => setActive("all")} className={`px-3 py-1.5 rounded-full text-xs border ${active === "all" ? "bg-[#7E5C58] text-[#F8F5F2] border-[#7E5C58]" : "bg-[#FBF8F5] border-[#DDD5D0]"}`}>
            All
          </button>
          {PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs border ${active === p.id ? "bg-[#7E5C58] text-[#F8F5F2] border-[#7E5C58]" : "bg-[#FBF8F5] border-[#DDD5D0]"}`}
            >
              {p.id}
            </button>
          ))}
        </div>
        <div className="mt-10 space-y-12">
          {list.map((p) => (
            <PaletteCard key={p.id} p={p} />
          ))}
        </div>
        <div className="mt-12 border-t border-[#DDD5D0] pt-8 space-y-3 text-sm font-light leading-relaxed text-[#574F4C] max-w-3xl">
          <p>
            <strong className="font-medium text-[#2B2624]">How to read this:</strong> A - the committed off-white default. B - charcoal for cinematic and dark sections. C - dusty mauve for the ownership chapter. D - muted blush for journal and quiet panels. The hierarchy (GROUND / INK / SECONDARY / ACTION / MATERIAL / FUNCTIONAL) stays fixed; each register only changes the proportion of the same palette.
          </p>
          <p>
            Tests to run: skin+zari on each ground (above), ink text AA on light grounds, light text AA on ink ground, CTA hover/pressed, card border separation, mobile density.
          </p>
        </div>
      </div>
    </div>
  );
}
