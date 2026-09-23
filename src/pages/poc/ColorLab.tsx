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
  material: string;
  material2: string;
  border: string;
  tagline: string;
};

const PALETTES: Palette[] = [
  {
    id: "A",
    name: "A — Jasmine Honest (evolved baseline)",
    desc: "Keep ivory calm, make sand/sakura visible, crimson disciplined. Fixes lying tokens without breaking restraint.",
    bg: "#F6F1EB",
    bgDeep: "#EDE7D9",
    ink: "#1A1A18",
    inkSoft: "#6B6560",
    accent: "#8B1E2D",
    accentHover: "#6E1522",
    material: "#C7A96D",
    material2: "#CFA9A2",
    border: "#E0D8C8",
    tagline: "Warm ivory · ink · alta crimson (once per viewport) · champagne + sakura as ritual accents",
  },
  {
    id: "B",
    name: "B — Dark Textile House (ink register)",
    desc: "Hero/chapters in ink, zari needs darkness. Highest premium signal, highest relight cost.",
    bg: "#171410",
    bgDeep: "#23201B",
    ink: "#F6F1EB",
    inkSoft: "#B8B0A0",
    accent: "#8B1E2D",
    accentHover: "#A82A3A",
    material: "#C7A96D",
    material2: "#CFA9A2",
    border: "#2C2A26",
    tagline: "Ink ground · zari gold lives here · crimson glows · photography must be relit",
  },
  {
    id: "C",
    name: "C — Festive Restraint (color with conviction)",
    desc: "Real peacock + marigold + kumkum, ruthlessly proportioned. Culturally located, hardest to keep quiet.",
    bg: "#F6F1E7",
    bgDeep: "#EDE6D5",
    ink: "#1F1A14",
    inkSoft: "#6B6258",
    accent: "#A4262C",
    accentHover: "#7E1C22",
    material: "#D99A2B",
    material2: "#2F5D5A",
    border: "#DDD5C2",
    tagline: "Peacock teal + marigold controlled · kumkum accent · proportion law required",
  },
  {
    id: "D",
    name: "D — Loom Record (archival stone)",
    desc: "Gallery/archive register. Stone + oxide + loom-wood. Ages well, risks cold without human layer.",
    bg: "#ECE7DB",
    bgDeep: "#DED8C8",
    ink: "#1C1B18",
    inkSoft: "#6E675C",
    accent: "#9A3B26",
    accentHover: "#7A2F1E",
    material: "#6B5138",
    material2: "#CFA9A2",
    border: "#D2C9B6",
    tagline: "Stone · oxide earth red · loom-wood · editorial, museum-like",
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
            { c: p.accent, label: "Alta" },
            { c: p.material, label: "Material" },
            { c: p.material2, label: "Sakura/Teal" },
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
            Not the harsh noon light, but the soft gold of early day, when everything is still possible. This is when a weave reveals itself.
          </p>
          <div className="flex gap-3 pt-2">
            <span className="px-4 py-2 rounded-full text-[0.65rem] tracking-[0.2em] uppercase text-white" style={{ background: p.accent }}>
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
              Molakalmuru Temple Silk — ₹ 48,000
            </p>
            <p className="text-xs" style={{ color: p.inkSoft }}>
              Mulberry · 12 momme · pit loom · 21 days
            </p>
          </div>
          <div className="h-px" style={{ background: p.border }} />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.accent }} />
            <span className="text-xs" style={{ color: p.inkSoft }}>
              Alta accent — saving, hover, editorial rule
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.material }} />
            <span className="text-xs" style={{ color: p.inkSoft }}>
              Material accent — price confidence, loom details
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
    <div className="min-h-screen bg-[#F6F1EB] text-[#1A1A18]">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <p className="text-[0.65rem] tracking-[0.42em] uppercase text-[#6B6560]">HOP · Color Lab · staging only</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight">Color territories vs silk, zari, skin.</h1>
        <p className="mt-4 text-sm font-light leading-relaxed max-w-2xl text-[#6B6560]">
          Same imagery, same type, same copy — only palette changes. Compare how each ground treats silk sheen, zari warmth, skin, and ink typography. No palette is committed; this is evidence.
        </p>
        <div className="mt-6 flex gap-2 flex-wrap">
          <button onClick={() => setActive("all")} className={`px-3 py-1.5 rounded-full text-xs border ${active === "all" ? "bg-[#1A1A18] text-white border-[#1A1A18]" : "bg-white border-[#E0D8C8]"}`}>
            All
          </button>
          {PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs border ${active === p.id ? "bg-[#1A1A18] text-white border-[#1A1A18]" : "bg-white border-[#E0D8C8]"}`}
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
        <div className="mt-12 border-t border-[#E0D8C8] pt-8 space-y-3 text-sm font-light leading-relaxed text-[#6B6560] max-w-3xl">
          <p>
            <strong className="font-medium text-[#1A1A18]">How to read this:</strong> A — repairs honesty without new hue risk. B — proves zari needs dark, but demands relight and re-verified AA. C — culturally located but hardest to keep quiet. D — archival, best for journal/about. The hierarchy to lock (GROUND / INK / SECONDARY / SIGNATURE / MATERIAL / FUNCTIONAL) is independent of which accent direction is chosen.
          </p>
          <p>
            Tests to run: skin+zari on each ground (above), ink text AA on light grounds, light text AA on ink ground, CTA hover/pressed, card border separation, mobile density.
          </p>
        </div>
      </div>
    </div>
  );
}
