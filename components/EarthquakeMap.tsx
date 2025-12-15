"use client";

import { useState, useMemo, useCallback, memo, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer, TextLayer } from "@deck.gl/layers";
import { FlyToInterpolator } from "@deck.gl/core";
import Map from "react-map-gl/mapbox";
import type { MapViewState, PickingInfo } from "@deck.gl/core";
import type { EarthquakeData } from "@/utils/mapUtils";
import { calculateBounds } from "@/utils/mapUtils";
import Supercluster from "supercluster";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -95.7129,
  latitude: 37.0902,
  zoom: 3.5,
  pitch: 0,
  bearing: 0,
};

interface EarthquakeMapProps {
  data: EarthquakeData[];
  selectedId: string | null;
  onFeatureClick: (id: string | null) => void;
  zoomToPosition?: [number, number, number] | null;
  zoomTrigger?: number;
  baseMapStyle: string;
}

function EarthquakeMap({
  data,
  selectedId,
  onFeatureClick,
  zoomToPosition,
  zoomTrigger,
  baseMapStyle,
}: EarthquakeMapProps) {
  const [internalViewState, setInternalViewState] =
    useState<MapViewState>(INITIAL_VIEW_STATE);
  const [hasAutoFitted, setHasAutoFitted] = useState(false);
  const [lastZoomTrigger, setLastZoomTrigger] = useState(0);

  useEffect(() => {
    if (data.length > 0 && !hasAutoFitted) {
      const bounds = calculateBounds(
        data,
        typeof window !== "undefined" ? window.innerWidth : 800,
        typeof window !== "undefined" ? window.innerHeight : 600
      );
      if (bounds) {
        setInternalViewState({
          ...bounds,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });
        setHasAutoFitted(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, hasAutoFitted]);

  useEffect(() => {
    if (
      zoomToPosition &&
      zoomTrigger &&
      zoomTrigger > 0 &&
      zoomTrigger !== lastZoomTrigger
    ) {
      const latitudeOffset = 0.08;
      setInternalViewState({
        longitude: zoomToPosition[0],
        latitude: zoomToPosition[1] - latitudeOffset,
        zoom: 10,
        pitch: 0,
        bearing: 0,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
      });
      setLastZoomTrigger(zoomTrigger);
    }
  }, [zoomToPosition, zoomTrigger, lastZoomTrigger]);

  const viewState = useMemo(() => {
    return internalViewState;
  }, [internalViewState]);

  const handleClick = useCallback(
    (info: PickingInfo) => {
      if (info.object) {
        if (info.layer?.id === "earthquakes") {
          const feature = info.object as {
            properties: { cluster: boolean; earthquakeId?: string };
          };
          if (!feature.properties.cluster && feature.properties.earthquakeId) {
            onFeatureClick(feature.properties.earthquakeId);
            return;
          }
        }
        onFeatureClick(null);
      } else {
        onFeatureClick(null);
      }
    },
    [onFeatureClick]
  );

  const getCursor = useCallback(
    ({ isHovering }: { isHovering: boolean }) =>
      isHovering ? "pointer" : "grab",
    []
  );

  const { clusters, supercluster } = useMemo(() => {
    if (!data || data.length === 0) {
      return { clusters: [], supercluster: null };
    }

    const index = new Supercluster({
      radius: 40,
      maxZoom: 10,
      minZoom: 2,
      minPoints: 2,
    });

    const points = data.map((eq) => ({
      type: "Feature" as const,
      properties: {
        cluster: false,
        earthquakeId: eq.id,
        magnitude: eq.magnitude,
        place: eq.place,
        time: eq.time,
        depth: eq.depth,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [eq.position[0], eq.position[1]],
      },
    }));

    index.load(points);

    const zoom = Math.floor(viewState.zoom);
    const bounds = [
      viewState.longitude - 180,
      viewState.latitude - 85,
      viewState.longitude + 180,
      viewState.latitude + 85,
    ] as [number, number, number, number];

    const clustersData = index.getClusters(bounds, zoom);

    return { clusters: clustersData, supercluster: index };
  }, [data, viewState.zoom, viewState.longitude, viewState.latitude]);

  const layers = useMemo(() => {
    if (!clusters || clusters.length === 0) return [];

    const clusterLayer = new ScatterplotLayer({
      id: "clusters",
      data: clusters.filter((c) => c.properties.cluster),
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 20,
      radiusMaxPixels: 80,
      lineWidthMinPixels: 2,
      getPosition: (d) => [
        d.geometry.coordinates[0],
        d.geometry.coordinates[1],
      ],
      getRadius: (d) => {
        const pointCount = d.properties.point_count;
        return Math.min(Math.sqrt(pointCount) * 10, 80);
      },
      getFillColor: [51, 136, 255, 180],
      getLineColor: [255, 255, 255],
      onClick: (info) => {
        if (info.object && supercluster) {
          const cluster = info.object;
          const expansionZoom = Math.min(
            supercluster.getClusterExpansionZoom(cluster.id as number),
            20
          );
          setInternalViewState({
            ...internalViewState,
            longitude: cluster.geometry.coordinates[0],
            latitude: cluster.geometry.coordinates[1],
            zoom: expansionZoom,
            transitionDuration: 500,
            transitionInterpolator: new FlyToInterpolator(),
          });
        }
      },
    });

    const clusterTextLayer = new TextLayer({
      id: "cluster-text",
      data: clusters.filter((c) => c.properties.cluster),
      pickable: false,
      getPosition: (d: (typeof clusters)[0]) => [
        d.geometry.coordinates[0],
        d.geometry.coordinates[1],
      ],
      getText: (d: (typeof clusters)[0]) => String(d.properties.point_count),
      getSize: 16,
      getColor: [255, 255, 255],
      getAngle: 0,
      getTextAnchor: "middle",
      getAlignmentBaseline: "center",
      fontFamily: "Arial, sans-serif",
      fontWeight: "bold",
    });

    const pointsLayer = new ScatterplotLayer<(typeof clusters)[0]>({
      id: "earthquakes",
      data: clusters.filter((c) => !c.properties.cluster),
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 3,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: (d) => [
        d.geometry.coordinates[0],
        d.geometry.coordinates[1],
      ],
      getRadius: (d) => {
        const magnitude = d.properties.magnitude;
        const baseRadius = magnitude * 10;
        return d.properties.earthquakeId === selectedId
          ? baseRadius * 1.5
          : baseRadius;
      },
      getFillColor: (d) => {
        if (d.properties.earthquakeId === selectedId) {
          return [255, 50, 50, 255];
        }
        const intensity = Math.min(d.properties.magnitude / 7, 1);
        return [255, Math.floor(140 * (1 - intensity)), 0, 200];
      },
      getLineColor: (d) =>
        d.properties.earthquakeId === selectedId ? [255, 255, 255] : [0, 0, 0],
      lineWidthScale: 1,
      updateTriggers: {
        getFillColor: [selectedId],
        getRadius: [selectedId],
        getLineColor: [selectedId],
      },
    });

    return [clusterLayer, clusterTextLayer, pointsLayer];
  }, [clusters, selectedId, supercluster, internalViewState]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: newViewState }) =>
          setInternalViewState({
            ...newViewState,
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
        onClick={handleClick}
        getCursor={getCursor}
        style={{ width: "100%", height: "100%" }}
      >
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle={baseMapStyle}
          projection="mercator"
          style={{ width: "100%", height: "100%" }}
        />
      </DeckGL>
    </div>
  );
}

export default memo(EarthquakeMap);
