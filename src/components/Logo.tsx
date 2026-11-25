export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <img
        src="/logo.png"
        alt="Maloxie"
        style={{ width: size, height: size }}
        className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
      />
      <span className="font-bold tracking-tight text-xl text-white/95">
        Maloxie
      </span>
    </div>
  );
}
