interface ErrorOverlayProps {
  error: string;
}

export default function ErrorOverlay({ error }: ErrorOverlayProps) {
  return (
    <div
      className="
      absolute top-4 left-1/2 -translate-x-1/2 z-50
      animate-in fade-in-0 slide-in-from-top-4 duration-300
    "
    >
      <div
        className="
        bg-gradient-to-br from-red-50 to-orange-50
        border-2 border-red-200
        rounded-2xl
        shadow-2xl shadow-red-500/20
        ring-1 ring-red-100
        max-w-md p-6
      "
      >
        <div className="flex items-start gap-4">
          <div
            className="
            flex-shrink-0
            w-12 h-12
            bg-gradient-to-br from-red-500 to-orange-600
            rounded-full
            flex items-center justify-center
            shadow-lg shadow-red-500/30
          "
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-red-900 text-lg mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-700 text-sm mb-4">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="
                w-full
                bg-gradient-to-r from-red-600 to-orange-600
                hover:from-red-700 hover:to-orange-700
                text-white font-semibold
                rounded-xl px-6 py-3
                shadow-lg shadow-red-500/30
                hover:shadow-xl hover:shadow-red-500/40
                hover:scale-105 active:scale-95
                transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
              "
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
