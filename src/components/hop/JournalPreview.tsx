import { Link } from "react-router-dom";
import fabricImg from "@/assets/hop-fabric.jpg";
import linenImg from "@/assets/hop-collection-linen.jpg";
import pattuImg from "@/assets/hop-collection-pattu.jpg";

export const JournalPreview = () => (
  <section className="container py-20 sm:py-28 lg:py-32">
    <div className="flex items-end justify-between mb-10 sm:mb-14 gap-4">
      <div>
        <p className="text-[0.65rem] sm:text-xs tracking-[0.42em] uppercase text-teal mb-3">The Journal</p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl">Slow words on cloth and light.</h2>
      </div>
      <Link to="/journal" className="hidden md:inline text-[0.7rem] tracking-[0.32em] uppercase text-ink hover:text-teal underline underline-offset-4">
        Read all
      </Link>
    </div>
    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
      {[{
        title: "How morning light reads a weave.",
        tag: "Light · Essay",
        img: fabricImg
      },
      {
        title: "Five drapes for a quiet wedding.",
        tag: "Drape · Guide",
        img: pattuImg
      },
      {
        title: "Linen, and the art of doing less.",
        tag: "Linen · Essay",
        img: linenImg
      }
      ].map((article) => (
        <Link key={article.title} to="/journal/1" className="group">
          <div className="aspect-[5/4] overflow-hidden rounded-md bg-jasmine-deep">
            <img
              src={article.img}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-1400 group-hover:scale-105"
            />
          </div>
          <p className="mt-5 text-[0.6rem] tracking-[0.42em] uppercase text-teal">{article.tag}</p>
          <h3 className="mt-2 font-serif text-xl sm:text-2xl text-ink leading-snug text-balance group-hover:text-teal transition-colors">
            {article.title}
          </h3>
        </Link>
      ))}
    </div>
  </section>
);