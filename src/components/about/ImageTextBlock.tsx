import { OptimizedImage } from "@/components/ui/OptimizedImage";

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
  return (
    <div className={`hop-page__split ${imagePosition === 'right' ? 'hop-page__split--reverse' : ''}`}>
      <div className="flex-1">
        {assetPath ? (
          <OptimizedImage
            assetPath={assetPath}
            fallbackSrc={image}
            alt={imageAlt}
            sizes="(max-width: 1024px) 100vw, 50vw"
            imgClassName="w-full aspect-square lg:aspect-auto lg:h-[800px] object-cover"
          />
        ) : (
          <img
            src={image}
            alt={imageAlt}
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