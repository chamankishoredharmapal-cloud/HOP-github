import { useState } from "react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { MediaImage } from "@/components/ui/MediaSurface";
import heroStill from "@/assets/hop-hero.jpg";

interface ImageTextBlockProps {
  image: string;
  imageAlt: string;
  title: string;
  content: string;
  imagePosition?: 'left' | 'right';
  assetPath?: string;
}

const ImageTextBlock = ({ 
  image, 
  imageAlt, 
  title, 
  content, 
  imagePosition = 'left',
  assetPath,
}: ImageTextBlockProps) => {
  const [hasError, setHasError] = useState(false);
  const displaySrc = hasError || !image ? heroStill : image;

  return (
    <div className={`hop-page__split ${imagePosition === 'right' ? 'hop-page__split--reverse' : ''}`}>
      <div className="flex-1">
        {assetPath && !hasError ? (
          <OptimizedImage
            assetPath={assetPath}
            fallbackSrc={displaySrc}
            alt={imageAlt}
            sizes="(max-width: 1024px) 100vw, 50vw"
            imgClassName="w-full aspect-square lg:aspect-auto lg:h-[800px] object-cover"
          />
        ) : (
          <MediaImage
            src={displaySrc}
            alt={imageAlt}
            onError={() => setHasError(true)}
            className="w-full aspect-square lg:aspect-auto lg:h-[800px] object-cover"
          />
        )}
      </div>
      <div className="flex-1 space-y-6">
        <h3 className="text-2xl font-light text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};

export default ImageTextBlock;