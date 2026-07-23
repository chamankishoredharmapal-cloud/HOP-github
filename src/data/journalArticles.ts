import fabricImg from "@/assets/hop-fabric.jpg";
import pattuImg from "@/assets/hop-collection-pattu.jpg";
import linenImg from "@/assets/hop-collection-linen.jpg";
import organzaImg from "@/assets/hop-collection-organza.jpg";
import giftImg from "@/assets/hop-gift.jpg";
import heroImg from "@/assets/hop-hero.jpg";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''.—,]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface JournalArticle {
  slug: string;
  title: string;
  tag: string;
  img: string;
  dek: string;
}

export const articles: JournalArticle[] = [
  { slug: slugify("How morning light reads a weave."), title: "How morning light reads a weave.", tag: "Light", img: fabricImg, dek: "On the soft hour between five and seven, when zari forgets to shine." },
  { slug: slugify("Five drapes for a quiet wedding."), title: "Five drapes for a quiet wedding.", tag: "Drape", img: pattuImg, dek: "An intimate ceremony asks for restraint — here are five." },
  { slug: slugify("Linen, and the art of doing less."), title: "Linen, and the art of doing less.", tag: "Linen", img: linenImg, dek: "Why our linens are washed, then washed again, then forgotten." },
  { slug: slugify("Organza in the rain."), title: "Organza in the rain.", tag: "Weather", img: organzaImg, dek: "Notes from a wet July afternoon in Pondicherry." },
  { slug: slugify("A keepsake card, printed in jasmine."), title: "A keepsake card, printed in jasmine.", tag: "Ritual", img: giftImg, dek: "On the small ceremony of wrapping a gift." },
  { slug: slugify("Padmavati — the name behind the house."), title: "Padmavati — the name behind the house.", tag: "House", img: heroImg, dek: "A short letter to the woman who wove our world." },
];
