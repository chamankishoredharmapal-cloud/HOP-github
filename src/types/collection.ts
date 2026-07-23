export interface CollectionDetail {
  id: string;
  name: string;
  slug: string;
  hero_image_url: string | null;
  hero_video_url: string | null;
  editorial_story: string | null;
  tagline: string | null;
  description: string | null;
  display_order: number;
  featured_on_homepage: boolean;
  status: string;
}
