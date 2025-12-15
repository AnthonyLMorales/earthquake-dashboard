"use client";

import { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import Map from "react-map-gl/mapbox";
import type { MapViewState } from "@deck.gl/core";
import { fetchEarthquakes } from "@/services/earthquakeApi";
import type { EarthquakeFeature } from "@/types/earthquake";

interface EarthquakeData {
  position: [number, number, number];
  magnitude: number;
  properties: EarthquakeFeature["properties"];
}

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -95.7129,
  latitude: 37.0902,
  zoom: 3.5,
  pitch: 0,
  bearing: 0,
};

export default function DeckGLMap() {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [data, setData] = useState<EarthquakeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEarthquakes() {
      try {
        setLoading(true);
        setError(null);
        const earthquakeData = await fetchEarthquakes();

        const transformedData: EarthquakeData[] = earthquakeData.features.map(
          (feature: EarthquakeFeature) => ({
            position: feature.geometry.coordinates,
            magnitude: feature.properties.mag || 0,
            properties: feature.properties,
          })
        );

        setData(transformedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load earthquake data"
        );
        console.error("Error loading earthquakes:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEarthquakes();
  }, []);

  const layers = [
    new ScatterplotLayer({
      id: "scatterplot-layer",
      data,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 3,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: (d: EarthquakeData) => d.position,
      getRadius: (d: EarthquakeData) => d.magnitude * 10,
      getFillColor: [255, 140, 0],
      getLineColor: [0, 0, 0],
    }),
  ];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) =>
          setViewState({
            ...viewState,
            pitch: 0,
            bearing: 0,
          } as MapViewState)
        }
        controller={{
          dragPan: true,
          scrollZoom: true,
          doubleClickZoom: true,
          dragRotate: false,
          touchRotate: false,
          keyboard: false,
        }}
        layers={layers}
        style={{ width: "100%", height: "100%" }}
      >
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v11"
          projection="mercator"
          style={{ width: "100%", height: "100%" }}
        />
      </DeckGL>

      {loading && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <span style={{ fontSize: "14px", color: "#333" }}>
            Loading earthquake data...
          </span>
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <p
            style={{ fontSize: "14px", color: "#d32f2f", margin: "0 0 8px 0" }}
          >
            Error: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Retry
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
