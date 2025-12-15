import { memo } from "react";
import type { EarthquakeData } from "@/utils/mapUtils";
import MagnitudeBadge from "./MagnitudeBadge";

interface EarthquakePopupProps {
  feature: EarthquakeData;
  onClose: () => void;
  onViewDetails?: (id: string) => void;
}

function EarthquakePopup({
  feature,
  onClose,
  onViewDetails,
}: EarthquakePopupProps) {
  const formattedTime = new Date(feature.time).toLocaleString();

  return (
    <div className="
      absolute top-4 left-4 z-50
      bg-white/95 backdrop-blur-xl
      border border-white/40
      shadow-2xl shadow-black/20
      ring-1 ring-black/5
      rounded-2xl
      max-w-sm overflow-hidden
      animate-in fade-in-0 zoom-in-95 slide-in-from-left-4 duration-200
    ">
      {/* Header with Gradient */}
      <div className="
        bg-gradient-to-r from-blue-600 to-cyan-600
        px-5 py-4
        flex items-center justify-between
      ">
        <h3 className="text-white font-bold text-lg">Earthquake Details</h3>
        <button
          onClick={onClose}
          className="
            bg-white/20 hover:bg-white/30
            text-white rounded-full p-2
            hover:scale-110 transition-all
            focus-visible:ring-2 focus-visible:ring-white
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content with MagnitudeBadge */}
      <div className="p-5 space-y-3">
        {/* Magnitude Badge - Prominent */}
        <div className="flex items-center justify-between">
          <span className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
            Magnitude
          </span>
          <MagnitudeBadge magnitude={feature.magnitude} size="lg" />
        </div>

        {/* Depth */}
        <div className="flex items-center gap-3 py-2 border-t border-slate-100">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <div className="flex-1">
            <div className="text-xs text-slate-500 uppercase tracking-wide">Depth</div>
            <div className="text-slate-900 font-semibold">{feature.depth.toFixed(1)} km</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 py-2 border-t border-slate-100">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex-1">
            <div className="text-xs text-slate-500 uppercase tracking-wide">Location</div>
            <div className="text-slate-900 font-medium text-sm">{feature.place}</div>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3 py-2 border-t border-slate-100">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <div className="text-xs text-slate-500 uppercase tracking-wide">Time</div>
            <div className="text-slate-900 font-medium text-sm">
              {formattedTime}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(feature.id)}
              className="
                w-full flex items-center justify-center gap-2
                bg-gradient-to-r from-purple-600 to-indigo-600
                hover:from-purple-700 hover:to-indigo-700
                text-white font-semibold
                px-4 py-3 rounded-lg
                transition-all duration-200
                hover:shadow-lg hover:scale-105
                focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View More Details
            </button>
          )}
          {feature.properties.url && (
            <a
              href={feature.properties.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-full flex items-center justify-center gap-2
                bg-gradient-to-r from-blue-600 to-cyan-600
                hover:from-blue-700 hover:to-cyan-700
                text-white font-semibold
                px-4 py-3 rounded-lg
                transition-all duration-200
                hover:shadow-lg hover:scale-105
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
              "
            >
              View on USGS Website
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(EarthquakePopup);
