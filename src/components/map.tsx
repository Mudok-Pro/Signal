
'use client';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Marker } from 'react-map-gl/maplibre';
import { Card } from './ui/card';
import type { Mechanic } from '@/lib/types';
import { MapPin } from 'lucide-react';

export function MapComponent({ mechanics }: { mechanics: Mechanic[] }) {

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  if (!apiKey) {
    return (
      <Card className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg border bg-muted flex flex-col items-center justify-center text-center p-4">
        <h3 className="font-bold text-lg text-destructive">
          Map Configuration Error
        </h3>
        <p className="text-muted-foreground text-sm">
          The map API key is missing. Please add{' '}
          <code className="bg-destructive/20 text-destructive font-mono text-xs p-1 rounded">
            NEXT_PUBLIC_MAPTILER_API_KEY
          </code>{' '}
          to your environment variables.
        </p>
      </Card>
    );
  }

  const mapStyle = `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;

  return (
    <Card className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg border">
      <Map
        initialViewState={{
          longitude: 46.6753,
          latitude: 24.7136,
          zoom: 11,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
      >
        {mechanics.map((mechanic) => (
          mechanic.location && (
            <Marker
              key={mechanic.id}
              longitude={mechanic.location.longitude}
              latitude={mechanic.location.latitude}
              anchor="bottom"
            >
              <div className="flex flex-col items-center_ text-center_ group_ cursor-pointer_">
                <MapPin className="w-8 h-8 text-primary drop-shadow-lg" />
              </div>
            </Marker>
          )
        ))}
      </Map>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />
    </Card>
  );
}
