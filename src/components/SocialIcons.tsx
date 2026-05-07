import { Linkedin, Instagram } from "lucide-react";
import { VEGA_CONTACTS, VEGA_SOCIAL_HREF } from "@/utils/contacts";

const SOCIALS = [
  {
    name: "LinkedIn",
    handle: VEGA_CONTACTS.linkedin,
    href: VEGA_SOCIAL_HREF.linkedin,
    Icon: Linkedin,
  },
  {
    name: "Instagram",
    handle: VEGA_CONTACTS.instagram,
    href: VEGA_SOCIAL_HREF.instagram,
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
