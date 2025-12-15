import { WebMercatorViewport } from "@deck.gl/core";
import type { MapViewState } from "@deck.gl/core";

export interface EarthquakeData {
  id: string;
  position: [number, number, number];
  magnitude: number;
  place: string;
  depth: number;
  time: number;
  properties: any;
}

export function calculateBounds(
  data: EarthquakeData[],
  width: number = 800,
  height: number = 600
): MapViewState | null {
  if (data.length === 0) return null;

  const lngs = data.map((d) => d.position[0]);
  const lats = data.map((d) => d.position[1]);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const viewport = new WebMercatorViewport({ width, height });

  const { longitude, latitude, zoom } = viewport.fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    { padding: 40 }
  );

  const constrainedZoom = Math.min(zoom, 12);

  return {
    longitude,
    latitude,
    zoom: constrainedZoom,
    pitch: 0,
    bearing: 0,
  };
}
