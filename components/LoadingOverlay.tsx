export default function LoadingOverlay() {
  return (
    <div
      className="
      absolute inset-0 z-50
      bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20
      backdrop-blur-md
      flex items-center justify-center
      animate-in fade-in-0 duration-200
    "
    >
      <div
        className="
        bg-white/90 backdrop-blur-xl
        rounded-2xl
        shadow-2xl shadow-black/20
        ring-1 ring-black/5
        px-8 py-6
        flex items-center gap-4
        animate-pulse
      "
      >
        <div className="relative w-12 h-12">
          <div
            className="
            absolute inset-0
            border-4 border-slate-200
            rounded-full
          "
          />
          <div
            className="
            absolute inset-0
            border-4 border-transparent
            border-t-blue-600 border-r-cyan-600
            rounded-full
            animate-spin
          "
          />
        </div>

        <div>
          <div
            className="
            bg-gradient-to-r from-blue-600 to-cyan-600
            bg-clip-text text-transparent
            font-bold text-lg
          "
          >
            Loading earthquakes...
          </div>
          <div className="text-slate-500 text-sm">Please wait</div>
        </div>
      </div>
    </div>
  );
}
