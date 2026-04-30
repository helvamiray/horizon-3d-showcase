import { BRANDS } from "@/data/products";

const BrandSlider = () => {
  const loop = [...BRANDS, ...BRANDS];
  return (
    <div className="relative w-full overflow-hidden border-y border-cyan/20 bg-background/60 backdrop-blur-md py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="marquee-track flex gap-12 whitespace-nowrap will-change-transform">
        {loop.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="font-display text-sm md:text-base tracking-[0.25em] uppercase text-foreground/70 hover:text-cyan transition-colors duration-300"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BrandSlider;
