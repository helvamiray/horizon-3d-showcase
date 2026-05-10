"use client";

import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type DockItem = {
  title: string;
  icon: ReactNode;
  href: string;
};

const motionHover = (reduced: boolean | null) =>
  reduced
    ? {}
    : {
        scale: 1.14,
        transition: { type: "spring" as const, stiffness: 420, damping: 26 },
      };

const motionTap = (reduced: boolean | null) =>
  reduced ? {} : { scale: 0.96 };

function DockLink({ title, icon, href }: DockItem) {
  const reduced = useReducedMotion();
  const external = href.startsWith("http");
  const noop = href === "#";

  const base =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-400 outline-none transition-colors hover:bg-white/[0.07] hover:text-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/35";

  const inner = (
    <span className="flex h-full w-full items-center justify-center p-1.5 [&_svg]:block [&_svg]:max-h-full [&_svg]:max-w-full [&_svg]:text-current">
      {icon}
    </span>
  );

  const tooltipContent = (
    <TooltipContent
      side="top"
      sideOffset={8}
      className="border border-white/10 bg-neutral-900 px-2.5 py-1.5 font-medium text-neutral-100 shadow-lg dark:bg-neutral-950"
      style={{ fontFamily: "var(--font-premium-body, system-ui)" }}
    >
      {title}
    </TooltipContent>
  );

  if (noop) {
    return (
      <Tooltip delayDuration={80}>
        <TooltipTrigger asChild>
          <motion.span
            aria-label={title}
            className={clsx(base, "cursor-default opacity-65")}
            whileHover={motionHover(reduced)}
            whileTap={motionTap(reduced)}
            style={{ transformOrigin: "50% 100%" }}
          >
            {inner}
          </motion.span>
        </TooltipTrigger>
        {tooltipContent}
      </Tooltip>
    );
  }

  return (
    <Tooltip delayDuration={80}>
      <TooltipTrigger asChild>
        <motion.a
          href={href}
          aria-label={title}
          className={base}
          whileHover={motionHover(reduced)}
          whileTap={motionTap(reduced)}
          style={{ transformOrigin: "50% 100%" }}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {inner}
        </motion.a>
      </TooltipTrigger>
      {tooltipContent}
    </Tooltip>
  );
}

/**
 * İletişim dock — hover’da hafif büyütme + tooltip (Framer Motion + Radix).
 */
export function FloatingDock({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={100}>
      <nav
        aria-label="İletişim bağlantıları"
        className={clsx(
          "flex h-[20rem] w-full items-center justify-center overflow-visible",
          className,
        )}
      >
        <div
          className={clsx(
            "flex flex-wrap items-center justify-center gap-1.5 overflow-visible rounded-2xl border border-white/10 bg-neutral-900/50 px-3 py-2.5 backdrop-blur-md dark:border-white/[0.08]",
          )}
        >
          {items.map((item) => (
            <DockLink key={item.title} {...item} />
          ))}
        </div>
      </nav>
    </TooltipProvider>
  );
}

/** FloatingDock ile aynı API — iletişim bölümü için alias */
export function FloatingDockDemo({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) {
  return <FloatingDock items={items} className={className} />;
}
