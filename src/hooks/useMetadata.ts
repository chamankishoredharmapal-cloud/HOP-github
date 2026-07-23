import { useEffect } from "react";

const BASE_URL = "https://houseofpadmavati.com";

interface MetadataConfig {
  title: string;
  description: string;
  ogImage?: string | null;
  ogType?: string;
  noIndex?: boolean;
}

const SITE_NAME = "House of Padmavati";
const TWITTER_HANDLE = "@houseofpadmavati";

export function useMetadata(config: MetadataConfig) {
  const { title, description, ogImage, ogType = "website", noIndex } = config;

  useEffect(() => {
    document.title = title;

    setMeta("description", description, "name");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", BASE_URL + window.location.pathname, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", title, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:site", TWITTER_HANDLE, "name");

    if (ogImage) {
      const absImage = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;
      setMeta("og:image", absImage, "property");
      setMeta("og:image:width", "1200", "property");
      setMeta("og:image:height", "630", "property");
      setMeta("twitter:image", absImage, "name");
    }

    if (noIndex) {
      setMeta("robots", "noindex, nofollow", "name");
    } else {
      const existing = document.querySelector('meta[name="robots"]');
      if (existing) existing.remove();
    }

    const canonical = BASE_URL + window.location.pathname;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);

    setMeta("viewport", "width=device-width, initial-scale=1", "name");
    setMeta("theme-color", "#F7F4EE", "name");
    setMeta("format-detection", "telephone=no", "name");
  }, [title, description, ogImage, ogType, noIndex]);
}

function setMeta(attrValue: string, content: string, attr: "name" | "property") {
  let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function addJsonLd(data: Record<string, unknown>) {
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}
