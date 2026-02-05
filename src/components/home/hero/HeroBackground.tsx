export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-white">
      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, #f0f0f0 100%)'
        }}
      />
    </div>
  );
}
