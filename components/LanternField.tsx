// A quiet visual — a few drifting lanterns on dark water. Per the brief:
// "Browsing should feel like walking along a shore at dusk, watching hundreds
// of small warm lights drift." We use a small number of lights so it stays
// quiet, not maximalist.

const lights = [
  { left: "8%", top: "18%", delay: "0s", size: 4, opacity: 0.55 },
  { left: "22%", top: "62%", delay: "1.4s", size: 3, opacity: 0.4 },
  { left: "37%", top: "30%", delay: "0.6s", size: 5, opacity: 0.7 },
  { left: "52%", top: "78%", delay: "2.1s", size: 3, opacity: 0.45 },
  { left: "65%", top: "12%", delay: "0.9s", size: 4, opacity: 0.5 },
  { left: "78%", top: "55%", delay: "1.7s", size: 5, opacity: 0.65 },
  { left: "88%", top: "26%", delay: "0.3s", size: 3, opacity: 0.35 },
  { left: "15%", top: "88%", delay: "2.5s", size: 4, opacity: 0.45 },
  { left: "70%", top: "85%", delay: "1.1s", size: 3, opacity: 0.4 },
];

export function LanternField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {lights.map((l, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-flame animate-lantern-drift"
          style={{
            left: l.left,
            top: l.top,
            width: `${l.size}px`,
            height: `${l.size}px`,
            opacity: l.opacity,
            boxShadow: `0 0 ${l.size * 3}px ${l.size}px rgba(244,162,60,${l.opacity * 0.6})`,
            animationDelay: l.delay,
          }}
        />
      ))}
    </div>
  );
}
