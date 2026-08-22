"use client"
export function SignalOrbit() {
  return (
    <div
      aria-hidden
      className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center sm:h-[380px] sm:w-[380px]"
    >
      {/* concentric rings — monochrome, matches the card/border tokens */}
      {[380, 300, 220, 140].map((size) => (
        <div
          key={size}
          className="absolute rounded-full border border-border"
          style={{ width: size, height: size }}
        />
      ))}

      {/* rotating sweep arm carrying the two signal blips */}
      <div className="absolute inset-0 motion-safe:animate-[orbit-sweep_14s_linear_infinite]">
        <span className="absolute left-1/2 top-[10px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-foreground" />
      </div>
      <div
        className="absolute inset-0 motion-safe:animate-[orbit-sweep_20s_linear_infinite]"
        style={{ animationDirection: "reverse" }}
      >
        <span className="absolute left-1/2 top-[50px] h-2 w-2 -translate-x-1/2 rounded-full bg-muted-foreground" />
      </div>

      {/* core */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card">
        <span className="h-3 w-3 rounded-full bg-foreground motion-safe:animate-[blip-pulse_2.2s_ease-in-out_infinite]" />
      </div>

      <span className="absolute -bottom-10 font-mono text-[11px] text-muted-foreground">
        signal_acquired · 0.4s
      </span>

      <style jsx>{`
        @keyframes orbit-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blip-pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
