import { Linkedin, Instagram } from "lucide-react";

const SOCIALS = [
  {
    name: "LinkedIn",
    handle: "vegaiklimlendirme",
    href: "https://www.linkedin.com/company/vegaiklimlendirme",
    Icon: Linkedin,
  },
  {
    name: "Instagram",
    handle: "vega.enerji",
    href: "https://instagram.com/vega.enerji",
    Icon: Instagram,
  },
];

const SocialIcons = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {SOCIALS.map(({ name, handle, href, Icon }) => (
      <a
        key={name}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} — ${handle}`}
        className="group relative grid place-items-center w-11 h-11 rounded-full glass border border-cyan/40 text-cyan transition-all duration-300 hover:border-cyan hover:-translate-y-0.5"
      >
        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono uppercase tracking-widest text-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
          @{handle}
        </span>
      </a>
    ))}
  </div>
);

export default SocialIcons;
