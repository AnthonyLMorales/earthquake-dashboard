import { memo } from "react";

interface MapControlsProps {
  isTableVisible: boolean;
  onToggleTable: () => void;
  earthquakeCount: number;
  baseMapStyle: string;
  onToggleBaseMap: () => void;
}

function MapControls({
  isTableVisible,
  onToggleTable,
  earthquakeCount,
  baseMapStyle,
  onToggleBaseMap,
}: MapControlsProps) {
  const getMapStyleName = (style: string) => {
    if (style === "mapbox://styles/mapbox/streets-v12") return "Streets";
    if (style === "mapbox://styles/mapbox/satellite-streets-v12") return "Satellite";
    if (style === "mapbox://styles/mapbox/dark-v11") return "Dark";
    if (style === "mapbox://styles/mapbox/light-v11") return "Light";
    return "Map";
  };

  return (
    <div className="absolute top-4 right-4 z-40 flex flex-col gap-3">
      <button
        onClick={onToggleTable}
        className="
          bg-gradient-to-r from-blue-600 to-cyan-600
          hover:from-blue-700 hover:to-cyan-700
          text-white font-semibold
          rounded-xl px-6 py-3
          shadow-lg shadow-blue-500/30
          hover:shadow-xl hover:shadow-blue-500/40
          hover:scale-105 active:scale-95
          transition-all duration-200
          focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          flex items-center gap-3
        "
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {isTableVisible ? "Hide Table" : "Show Table"}
      </button>
      <div className="
        bg-white/90 backdrop-blur-lg
        border border-white/40
        shadow-lg shadow-black/5
        rounded-xl px-4 py-3
        flex items-center gap-2
      ">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-slate-700 font-semibold">
          {earthquakeCount.toLocaleString()}
        </span>
        <span className="text-slate-500 text-sm">earthquakes</span>
      </div>
      <button
        onClick={onToggleBaseMap}
        className="
          bg-gradient-to-r from-slate-600 to-slate-700
          hover:from-slate-700 hover:to-slate-800
          text-white font-semibold
          rounded-xl px-6 py-3
          shadow-lg shadow-slate-500/30
          hover:shadow-xl hover:shadow-slate-500/40
          hover:scale-105 active:scale-95
          transition-all duration-200
          focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2
          flex items-center gap-3
        "
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        {getMapStyleName(baseMapStyle)}
      </button>
    </div>
  );
}

export default memo(MapControls);
