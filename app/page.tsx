"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEarthquakeData } from "@/store/slices/earthquakeSlice";
import {
  setSelectedId,
  toggleTable,
  setZoomToPosition,
  openDetailModal,
  closeDetailModal,
  setBaseMapStyle,
} from "@/store/slices/uiSlice";
import EarthquakeMap from "@/components/EarthquakeMap";
import EarthquakeTable from "@/components/EarthquakeTable";
import EarthquakePopup from "@/components/EarthquakePopup";
import EarthquakeDetailModal from "@/components/EarthquakeDetailModal";
import MapControls from "@/components/MapControls";
import LoadingOverlay from "@/components/LoadingOverlay";
import ErrorOverlay from "@/components/ErrorOverlay";

export default function Home() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.earthquakes);
  const {
    selectedId,
    isTableVisible,
    zoomToPosition,
    zoomTrigger,
    isDetailModalOpen,
    detailModalId,
    baseMapStyle,
  } = useAppSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchEarthquakeData());
  }, [dispatch]);

  const selectedFeature = useMemo(
    () => data.find((d) => d.id === selectedId) || null,
    [data, selectedId]
  );

  const detailModalFeature = useMemo(
    () => data.find((d) => d.id === detailModalId) || null,
    [data, detailModalId]
  );

  const handleFeatureClick = useCallback(
    (id: string | null) => {
      dispatch(setSelectedId(id));
    },
    [dispatch]
  );

  const handleRowClick = useCallback(
    (id: string, position: [number, number, number]) => {
      dispatch(setSelectedId(id));
      dispatch(setZoomToPosition(position));
    },
    [dispatch]
  );

  const handleToggleTable = useCallback(() => {
    dispatch(toggleTable());
  }, [dispatch]);

  const handleClosePopup = useCallback(() => {
    dispatch(setSelectedId(null));
  }, [dispatch]);

  const handleOpenDetailModal = useCallback(
    (id: string) => {
      dispatch(openDetailModal(id));
    },
    [dispatch]
  );

  const handleCloseDetailModal = useCallback(() => {
    dispatch(closeDetailModal());
  }, [dispatch]);

  const handleToggleBaseMap = useCallback(() => {
    const mapStyles = [
      "mapbox://styles/mapbox/streets-v12",
      "mapbox://styles/mapbox/satellite-streets-v12",
      "mapbox://styles/mapbox/dark-v11",
      "mapbox://styles/mapbox/light-v11"
    ];
    const currentIndex = mapStyles.indexOf(baseMapStyle);
    const nextIndex = (currentIndex + 1) % mapStyles.length;
    dispatch(setBaseMapStyle(mapStyles[nextIndex]));
  }, [dispatch, baseMapStyle]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <EarthquakeMap
        data={data}
        selectedId={selectedId}
        onFeatureClick={handleFeatureClick}
        zoomToPosition={zoomToPosition}
        zoomTrigger={zoomTrigger}
        baseMapStyle={baseMapStyle}
      />

      <MapControls
        isTableVisible={isTableVisible}
        onToggleTable={handleToggleTable}
        earthquakeCount={data.length}
        baseMapStyle={baseMapStyle}
        onToggleBaseMap={handleToggleBaseMap}
      />

      {selectedFeature && (
        <EarthquakePopup
          feature={selectedFeature}
          onClose={handleClosePopup}
          onViewDetails={handleOpenDetailModal}
        />
      )}

      <EarthquakeTable
        data={data}
        isVisible={isTableVisible}
        onRowClick={handleRowClick}
        selectedId={selectedId}
        onViewDetails={handleOpenDetailModal}
      />

      <EarthquakeDetailModal
        feature={detailModalFeature}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />

      {loading && <LoadingOverlay />}
      {error && <ErrorOverlay error={error} />}
    </div>
  );
}
