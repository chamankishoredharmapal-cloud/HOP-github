import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ChevronRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Film } from "@/components/hop/Film";
import { HomepageCinematicVideo } from "@/components/hop/HomepageCinematicVideo";
import { Monogram } from "@/components/hop/Monogram";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useCart } from "@/contexts/CartContext";
import { useJournalArticles } from "@/hooks/useJournal";
import { COLLECTION_VIDEOS } from "@/data/collectionVideos";
import { COLLECTION_WORLDS, getWorld, getCollectionDisplayName, getCollectionRoomSlug, type CollectionWorld } from "@/data/collectionWorlds";
import { fetchCollections } from "@/services/collectionService";
import { fetchFeaturedCollection } from "@/services/collectionService";
import { fetchFeaturedProduct, type StorefrontProduct } from "@/services/productService";
import { fetchPublicStoreSettings } from "@/services/settingsService";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import "@/components/hop/HomepageExperience.css";

import heroStill from "@/assets/hop-hero.jpg";
import fabricStill from "@/assets/hop-fabric.jpg";
import organzaStill from "@/assets/hop-collection-organza.jpg";
import pattuStill from "@/assets/hop-collection-pattu.jpg";
import linenStill from "@/assets/hop-collection-linen.jpg";

const WORLD_ORDER: CollectionWorld[] = [
  COLLECTION_WORLDS.kalyani,
  COLLECTION_WORLDS.viara,
  COLLECTION_WORLDS.arya,
  COLLECTION_WORLDS.padma,
  COLLECTION_WORLDS.yugen,
];

const WORLD_COPY: Record<string, { title: string; line: string; image?: string; alt?: string }> = {
  kalyani: {
    title: "The threshold",
    line: "The one that changes the temperature of the room.",
    image: pattuStill,
    alt: "Temporary material study for Kalyani collection photography — not a product image",
  },
  viara: {
    title: "After-light",
    line: "Presence without volume.",
    image: linenStill,
    alt: "Temporary material study for Viara collection photography — not a product image",
  },
  arya: {
    title: "Daily rhythm",
    line: "Dressed for her own structure.",
    image: organzaStill,
    alt: "Temporary material study for Arya collection photography — not a product image",
  },
  padma: {
    title: "The weave as architecture",
    line: "Order, made visible.",
    image: fabricStill,
    alt: "Temporary visual placeholder for Padma collection photography — not a product image",
  },
  yugen: {
    title: "Color with a pulse",
    line: "Confidence, worn.",
    image: organzaStill,
    alt: "Temporary visual placeholder for YŪGEN collection photography — not a product image",
  },
};

const HOUSE_NOTES = [
  {
    label: "The hand",
    title: "A body in motion.",
    text: "A saree holds the decisions behind it. The tension of the thread, the balance of the border and the patience of its making all remain in the cloth.",
    link: "Read the pit loom",
    href: "/journal/the-pit-loom",
  },
  {
    label: "The keeping",
    title: "Meaning over excess.",
    text: "We design for the women who will inherit these drapes. Care, repair and a long life are part of the pleasure of choosing well.",
    link: "Explore saree care",
    href: "/customer-care",
  },
  {
    label: "The giving",
    title: "A considered gesture.",
    text: "Some arrivals are meant to be witnessed. The house keeps the language of gifting quiet, personal and human.",
    link: "Begin a gift",
    href: "/gift",
  },
];

const formatPrice = (paise: number) => `₹ ${(paise / 100).toLocaleString("en-IN")}`;

const getCollection = (collections: Awaited<ReturnType<typeof fetchCollections>> | undefined, world: CollectionWorld) =>
  collections?.find((collection) => getWorld(collection.slug)?.slug === world.slug);

const EditorialImage = ({
  src,
  assetPath,
  alt,
  className = "",
  priority = false,
  sizes = "100vw",
}: {
  src: string;
  assetPath?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) => {
  const [hasError, setHasError] = useState(false);
  const displaySrc = hasError ? heroStill : src;

  if (assetPath && !hasError) {
    return (
      <OptimizedImage
        assetPath={assetPath}
        fallbackSrc={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={`h-full w-full ${className}`}
        imgClassName="h-full w-full object-cover"
      />
    );
  }

  return (
    <img
      src={displaySrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setHasError(true)}
      {...(priority ? { fetchpriority: "high" } : {})}
      className={`h-full w-full object-cover ${className}`}
    />
  );
};

const ArrowLink = ({ to, children, light = false }: { to: string; children: React.ReactNode; light?: boolean }) => (
  <Link
    to={to}
    className={`hop-arrow-link ${light ? "hop-arrow-link--light" : ""}`}
  >
    <span>{children}</span>
    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
  </Link>
);

const Threshold = () => {
  const queryClient = useQueryClient();
  const { data: featured } = useQuery({
    queryKey: ["storefront", "featuredCollection"],
    queryFn: fetchFeaturedCollection,
  });

  const initialFeatured = queryClient.getQueryData<{ hero_video_url?: string; hero_image_url?: string; name?: string }>(["storefront", "featuredCollection"]);
  const effectiveFeatured = initialFeatured || featured;
  const poster = effectiveFeatured?.hero_image_url || heroStill;
  const collectionName = effectiveFeatured?.name ?? "House of Padmavati";
  const videoSrc = effectiveFeatured?.hero_video_url || COLLECTION_VIDEOS.kalyani;

  return (
    <section className="hop-threshold" aria-labelledby="threshold-title">
      <Film
        src={videoSrc}
        poster={poster}
        alt={`${collectionName} — House of Padmavati collection film`}
        className="hop-threshold__film"
        preload="metadata"
        priority
      />
      <div className="hop-threshold__veil" aria-hidden="true" />
      <div className="hop-threshold__content">
        <div className="hop-threshold__eyebrow">
          <Monogram variant="signature" className="hop-threshold__mark" />
          <span>{collectionName}</span>
        </div>
        <h1 id="threshold-title" className="hop-display hop-threshold__title">
          Saree. Time. You.
        </h1>
        <p className="hop-threshold__supporting">Five ways of wearing tradition — considered deeply, chosen quietly.</p>
        <div className="hop-threshold__actions">
          <ArrowLink to="/collections" light>Enter the House</ArrowLink>
          <a className="hop-scroll-cue" href="#collections">
            <span>Descend into the house</span>
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => (
  <section id="philosophy" className="hop-philosophy" aria-labelledby="philosophy-title">
    <div className="hop-philosophy__rule" aria-hidden="true" />
    <div className="hop-philosophy__copy">
      <h2 id="philosophy-title" className="hop-display hop-philosophy__title">A House,<br />Not a Shop.</h2>
      <p className="hop-reading hop-philosophy__body">We make room for the intelligence of considered making, the patience of cloth and the woman who chooses what to carry.</p>
      <p className="hop-reading hop-philosophy__body">Not a season. Not a trend. A relationship with what lasts.</p>
    </div>
  </section>
);

const CollectionFilmChapter = ({
  world,
  record,
  priority = false,
}: {
  world: CollectionWorld;
  record: Awaited<ReturnType<typeof fetchCollections>>[number] | undefined;
  priority?: boolean;
}) => {
  const copy = WORLD_COPY[world.slug];
  const poster = record?.hero_image_url || copy?.image || "";
  const film = record?.hero_video_url || COLLECTION_VIDEOS[world.slug];
  // Canonical identity: the visible title, chapter class, and link follow
  // the world (YŪGEN), never the legacy database record (Spandana).
  const name = getCollectionDisplayName(record?.slug, record?.name) || world.name;
  const slug = getCollectionRoomSlug(record?.slug);

  return (
    <article
      className={`hop-collection-film-chapter hop-collection-film-chapter--${slug}`}
      style={{ "--room-accent": world.accent } as React.CSSProperties}
    >
      <Link
        to={`/collections/${slug}`}
        className="hop-collection-film"
        aria-label={`Enter the ${name} collection`}
      >
        <Film
          src={film}
          poster={poster}
          alt={record?.hero_image_url ? `${name} — collection film` : copy?.alt || `${name} — collection film`}
          className="hop-collection-film__media"
          preload="metadata"
          priority={priority}
        />
        <span className="hop-collection-film__veil" aria-hidden="true" />
        <span className="hop-collection-film__identity">
          <Monogram variant="signature" className="hop-collection-film__mark" />
          <h3 className="hop-editorial-name hop-collection-film__name">{name}</h3>
          {world.emotion && (
            <span className="hop-collection-film__emotion">{world.emotion}</span>
          )}
        </span>
      </Link>
    </article>
  );
};

const CollectionRooms = () => {
  const { data: collections, isLoading } = useQuery({
    queryKey: ["storefront", "collections"],
    queryFn: fetchCollections,
  });

  usePrerenderReady(!isLoading);

  const chapters =
    collections && collections.length > 0
      ? collections.map((record) => {
          const world = getWorld(record.slug) || {
            slug: record.slug,
            name: record.name,
            emotion: record.tagline || "",
            temperature: "",
            accent: "#8B1E2D",
            accentName: "Alta Crimson",
            photo: "",
            material: "",
            vocabulary: "",
            device: "",
          };
          return { world, record };
        })
      : WORLD_ORDER.map((world) => ({
          world,
          record: getCollection(collections, world),
        }));

  return (
    <section id="collections" className="hop-collections" aria-labelledby="collections-title">
      <div className="hop-collection-films" aria-label="HOP collection worlds">
        {chapters.map(({ world, record }, index) => (
          <CollectionFilmChapter
            key={world.slug}
            world={world}
            record={record}
            priority={index === 0}
          />
        ))}
      </div>
    </section>
  );
};

const Craft = () => (
  <section id="craft" className="hop-craft" aria-labelledby="craft-title">
    <div className="hop-craft__image">
      <img
        src="/content/weaver-portrait/gangamma-molakalmuru/hero.jpg"
        alt="Gangamma at her pit loom, morning light from the window behind her"
        loading="lazy"
        decoding="async"
        onError={(event) => {
          event.currentTarget.src = heroStill;
        }}
        className="h-full w-full object-cover"
      />
      <p className="hop-craft__caption">Gangamma at her pit loom · Molakalmuru · 6:30 AM</p>
    </div>
    <div className="hop-craft__copy">
      <h2 id="craft-title" className="hop-display hop-craft__title">Detail is<br />part of the design.</h2>
      <p className="hop-reading hop-craft__body">Before a saree reaches the wardrobe, it passes through a series of considered decisions.</p>
      <blockquote className="hop-craft__quote">“The border is the signature. Without it, the saree is a stranger.”<cite>— Gangamma</cite></blockquote>
      <p className="hop-craft__fact">Molakalmuru, Karnataka · Temple border weaving · Fourth generation</p>
      <ArrowLink to="/journal/gangamma-molakalmuru" light>Meet the makers</ArrowLink>
    </div>
  </section>
);

const AddToBag = ({ product }: { product: StorefrontProduct }) => {
  const { addItem } = useCart();
  const image = product.images[0]?.url || "";
  const inStock = (product.stock ?? 0) > 0;

  const handleAdd = () => {
    if (!inStock) return;
    addItem({
      id: `product-${product.id}`,
      productId: product.id,
      name: product.name,
      price: product.selling_price,
      formattedPrice: formatPrice(product.selling_price),
      stock: product.stock,
      image,
    });
    toast.success("Added to the Bag", { description: product.name });
  };

  return (
    <button type="button" className="hop-primary-button" onClick={handleAdd} disabled={!inStock}>
      {inStock ? "Place in the Bag" : "Currently unavailable"}
    </button>
  );
};

const ProductDesire = () => {
  const { data: product, isLoading } = useQuery({
    queryKey: ["storefront", "featuredProduct"],
    queryFn: fetchFeaturedProduct,
  });

  if (isLoading) {
    return (
      <section className="hop-product-desire hop-product-desire--loading" aria-label="A drape to live with">
        <div className="hop-product-desire__loading-image" />
        <div className="hop-product-desire__loading-copy" />
      </section>
    );
  }

  if (!product) {
    return (
      <section className="hop-product-desire hop-product-desire--empty" aria-labelledby="product-desire-title">
        <div>
          <h2 id="product-desire-title" className="hop-display hop-product-desire__title">The first drape<br />is being chosen.</h2>
          <p className="hop-reading">Enter the house to discover the sarees currently available.</p>
          <ArrowLink to="/collections">Explore Collections</ArrowLink>
        </div>
      </section>
    );
  }

  const image = product.images[0]?.url || organzaStill;
  const details = [
    product.fabric && { label: "Fabric", value: product.fabric },
    product.weave && { label: "Weave", value: product.weave },
    product.colour && { label: "Colour", value: product.colour },
    product.country_of_origin && { label: "Origin", value: product.country_of_origin },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section className="hop-product-desire" aria-labelledby="product-desire-title">
      <div className="hop-product-desire__image">
        <img
          src={image}
          alt={product.images[0]?.alt_text || `${product.name} — featured drape`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="hop-product-desire__image-note">Full drape · Material truth · One considered object</span>
      </div>
      <div className="hop-product-desire__copy">
        <p className="hop-product-desire__collection">{product.collection_name || "The House selection"}</p>
        <h2 id="product-desire-title" className="hop-editorial-name hop-product-desire__title">{product.name}</h2>
        <p className="hop-reading hop-product-desire__story">{product.customer_description || product.short_description || product.story}</p>
        <div className="hop-product-desire__details">
          {details.map((detail) => (
            <div key={detail.label}>
              <span>{detail.label}</span>
              <strong>{detail.value}</strong>
            </div>
          ))}
        </div>
        <div className="hop-product-desire__purchase">
          <div>
            <span className="hop-product-desire__price-label">Price</span>
            <strong className="hop-product-desire__price">{formatPrice(product.selling_price)}</strong>
          </div>
          <AddToBag product={product} />
        </div>
        <p className="hop-product-desire__availability">{product.stock && product.stock > 0 ? "Available for the next choice" : "Join the house to hear when it returns"}</p>
        <ArrowLink to={`/product/${product.id}`}>View the full drape</ArrowLink>
      </div>
    </section>
  );
};

const Ownership = () => (
  <section id="ownership" className="hop-ownership" aria-labelledby="ownership-title">
    <div className="hop-ownership__heading">
      <h2 id="ownership-title" className="hop-display hop-ownership__title">Wear it slowly.<br />Keep it long.</h2>
      <p className="hop-reading hop-ownership__body">A first drape, a simple ritual, a lifetime of care. Ownership is part of the beauty.</p>
    </div>
    <div className="hop-ownership__notes">
      {HOUSE_NOTES.map((note) => (
        <article key={note.label} className="hop-ownership-note">
          <div>
            <p className="hop-ownership-note__label">{note.label}</p>
            <h3 className="hop-editorial-name">{note.title}</h3>
            <p className="hop-reading">{note.text}</p>
            <ArrowLink to={note.href}>{note.link}</ArrowLink>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const Journal = () => {
  const [active, setActive] = useState(0);
  const { data: articles = [] } = useJournalArticles();

  if (!articles || articles.length === 0) {
    return null;
  }

  const lead = articles[0];
  const secondary = articles.slice(1, 3);

  return (
    <section id="journal" className="hop-journal" aria-labelledby="journal-title">
      <div className="hop-journal__header">
        <h2 id="journal-title" className="hop-display hop-journal__title">Field notes from<br />the cloth, the room<br />and the wardrobe.</h2>
        <p className="hop-reading hop-journal__body">Stories of making, wearing, keeping and choosing well.</p>
      </div>
      <div className="hop-journal__layout">
        <Link to={`/journal/${lead.slug}`} className="hop-journal__lead">
          <div className="hop-journal__lead-image">
            <EditorialImage
              src={lead.img}
              assetPath={lead.assetPath}
              alt={lead.title}
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <div className="hop-journal__lead-meta">
            <span>{lead.tag}</span>
            <span>Field note</span>
          </div>
          <h3 className="hop-editorial-name">{lead.title}</h3>
          <p className="hop-reading">{lead.dek}</p>
          <span className="hop-text-link">Read the note <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
        </Link>
        <div className="hop-journal__notes">
          {secondary.map((article, index) => (
            <Link key={article.slug} to={`/journal/${article.slug}`} className={`hop-journal-note ${active === index ? "hop-journal-note--active" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}>
              <div className="hop-journal-note__image">
                <EditorialImage src={article.img} assetPath={article.assetPath} alt={article.title} sizes="(max-width: 768px) 100vw, 25vw" />
              </div>
              <div>
                <span className="hop-journal-note__tag">{article.tag}</span>
                <h3 className="hop-editorial-name">{article.title}</h3>
                <p className="hop-reading">{article.dek}</p>
              </div>
            </Link>
          ))}
          <Link to="/journal" className="hop-text-link hop-journal__all">All house letters <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
};

const Invitation = () => (
  <section className="hop-invitation" aria-labelledby="invitation-title">
    <div className="hop-invitation__glow" aria-hidden="true" />
    <div className="hop-invitation__content">
      <Monogram variant="signature" className="hop-invitation__mark" />
      <h2 id="invitation-title" className="hop-display hop-invitation__title">Come in quietly.<br />Choose slowly.</h2>
      <p className="hop-reading hop-invitation__body">There is no rush here. Explore the collections, or begin a conversation with the house.</p>
      <div className="hop-invitation__actions">
        <ArrowLink to="/collections" light>Explore Collections</ArrowLink>
        <ArrowLink to="/journal" light>House Letters</ArrowLink>
        <ArrowLink to="/customer-care" light>Contact / Conversation</ArrowLink>
      </div>
    </div>
  </section>
);

export const HomepageExperience = () => {
  const { data: storeSettings } = useQuery({
    queryKey: ["storefront", "settings"],
    queryFn: fetchPublicStoreSettings,
  });

  const cinematicVideo = storeSettings?.homepage_cinematic_video;

  return (
    <main className="hop-home">
      <Threshold />
      <HomepageCinematicVideo
        src={cinematicVideo?.video_url || undefined}
        poster={cinematicVideo?.poster_url || undefined}
        alt={cinematicVideo?.alt_text || "House of Padmavati — Homepage cinematic film"}
      />
      <CollectionRooms />
      <ProductDesire />
      <Craft />
      <Philosophy />
      <Ownership />
      <Journal />
      <Invitation />
    </main>
  );
};

export default HomepageExperience;
