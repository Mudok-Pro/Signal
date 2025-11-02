import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from './ui/card';

export function MapPlaceholder() {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-placeholder');

  return (
    <Card className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg border">
      {mapImage ? (
        <Image 
          src={mapImage.imageUrl} 
          alt={mapImage.description} 
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint={mapImage.imageHint}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Map will be displayed here</p>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
    </Card>
  );
}
