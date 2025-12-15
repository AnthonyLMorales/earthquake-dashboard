"use client";

import { memo } from "react";
import type { EarthquakeData } from "@/utils/mapUtils";
import MagnitudeBadge from "./MagnitudeBadge";

interface EarthquakeDetailModalProps {
  feature: EarthquakeData | null;
  isOpen: boolean;
  onClose: () => void;
}

function EarthquakeDetailModal({
  feature,
  isOpen,
  onClose,
}: EarthquakeDetailModalProps) {
  if (!isOpen || !feature) return null;

  const formattedTime = new Date(feature.time).toLocaleString();
  const formattedUpdated = feature.properties.updated
    ? new Date(feature.properties.updated).toLocaleString()
    : "N/A";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="
            bg-white rounded-2xl shadow-2xl
            max-w-4xl w-full max-h-[90vh] overflow-y-auto
            pointer-events-auto
            animate-in fade-in-0 zoom-in-95 duration-200
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-white font-bold text-2xl">Earthquake Details</h2>
              <MagnitudeBadge magnitude={feature.magnitude} size="lg" />
            </div>
            <button
              onClick={onClose}
              className="
                bg-white/20 hover:bg-white/30
                text-white rounded-full p-2
                hover:scale-110 transition-all
                focus-visible:ring-2 focus-visible:ring-white
              "
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {feature.properties.title || "Earthquake Event"}
              </h3>
              <p className="text-slate-600 text-lg">{feature.place}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Basic Information
                  </h4>

                  <DetailRow label="Magnitude" value={feature.magnitude?.toFixed(1) || "N/A"} />
                  <DetailRow label="Magnitude Type" value={feature.properties.magType?.toUpperCase() || "N/A"} />
                  <DetailRow label="Depth" value={feature.depth ? `${feature.depth.toFixed(2)} km` : "N/A"} />
                  <DetailRow label="Event Type" value={feature.properties.type || "N/A"} capitalize />
                  <DetailRow label="Status" value={feature.properties.status || "N/A"} capitalize />
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">
                    Time Information
                  </h4>

                  <DetailRow label="Occurred" value={formattedTime} />
                  <DetailRow label="Last Updated" value={formattedUpdated} />
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-3">
                    Location
                  </h4>

                  <DetailRow
                    label="Coordinates"
                    value={`${feature.position[1].toFixed(4)}°, ${feature.position[0].toFixed(4)}°`}
                  />
                  <DetailRow label="Network" value={feature.properties.net?.toUpperCase() || "N/A"} />
                  <DetailRow label="Event ID" value={feature.id || "N/A"} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                  <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-3">
                    Impact & Alert
                  </h4>

                  <DetailRow
                    label="Alert Level"
                    value={feature.properties.alert?.toUpperCase() || "N/A"}
                    badge={feature.properties.alert}
                  />
                  <DetailRow label="Significance" value={feature.properties.sig?.toString() || "N/A"} />
                  <DetailRow
                    label="Tsunami Warning"
                    value={feature.properties.tsunami === 1 ? "⚠️ YES" : feature.properties.tsunami === 0 ? "No" : "N/A"}
                  />
                  <DetailRow label="Felt Reports" value={feature.properties.felt?.toLocaleString() || "N/A"} />
                  <DetailRow label="CDI" value={feature.properties.cdi?.toFixed(1) || "N/A"} />
                  <DetailRow label="MMI" value={feature.properties.mmi?.toFixed(1) || "N/A"} />
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-3">
                    Technical Data
                  </h4>

                  <DetailRow label="Stations Used" value={feature.properties.nst?.toString() || "N/A"} />
                  <DetailRow label="Azimuthal Gap" value={feature.properties.gap ? `${feature.properties.gap}°` : "N/A"} />
                  <DetailRow label="Min Distance" value={feature.properties.dmin?.toFixed(2) || "N/A"} />
                  <DetailRow label="RMS" value={feature.properties.rms?.toFixed(3) || "N/A"} />
                  <DetailRow label="Code" value={feature.properties.code || "N/A"} />
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">
                    Additional Info
                  </h4>

                  <DetailRow label="Sources" value={feature.properties.sources || "N/A"} />
                  <DetailRow label="Types" value={feature.properties.types || "N/A"} />
                  <DetailRow label="IDs" value={feature.properties.ids || "N/A"} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {feature.properties.url && (
                <a
                  href={feature.properties.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex-1 flex items-center justify-center gap-2
                    bg-gradient-to-r from-blue-600 to-cyan-600
                    hover:from-blue-700 hover:to-cyan-700
                    text-white font-semibold
                    px-6 py-3 rounded-lg
                    transition-all duration-200
                    hover:shadow-lg hover:scale-105
                    focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                  "
                >
                  View on USGS Website
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {feature.properties.detail && (
                <a
                  href={feature.properties.detail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex-1 flex items-center justify-center gap-2
                    bg-slate-600 hover:bg-slate-700
                    text-white font-semibold
                    px-6 py-3 rounded-lg
                    transition-all duration-200
                    hover:shadow-lg hover:scale-105
                    focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2
                  "
                >
                  GeoJSON Details
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailRow({
  label,
  value,
  capitalize = false,
  badge = null
}: {
  label: string;
  value: string;
  capitalize?: boolean;
  badge?: string | null;
}) {
  const getBadgeColor = (alert: string) => {
    const colors = {
      green: "bg-green-100 text-green-800 border-green-300",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
      orange: "bg-orange-100 text-orange-800 border-orange-300",
      red: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[alert as keyof typeof colors] || "bg-slate-100 text-slate-800 border-slate-300";
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-200/50 last:border-0">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      {badge && value !== "N/A" ? (
        <span className={`text-xs font-semibold px-2 py-1 rounded border ${getBadgeColor(badge)}`}>
          {value}
        </span>
      ) : (
        <span className={`text-sm font-semibold text-slate-900 ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </span>
      )}
    </div>
  );
}

export default memo(EarthquakeDetailModal);
