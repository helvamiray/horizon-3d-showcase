import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Inbox, LogOut, MapPinned } from "lucide-react";
import { useInboxUnreadCount } from "@/hooks/useInboxUnreadCount";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onLogout: () => void;
}

type NavItem = { to: string; label: string; icon: typeof LayoutGrid; match: (path: string) => boolean };

const NAV: NavItem[] = [
  {
    to: "/admin",
    label: "Ürünler",
    icon: LayoutGrid,
    match: (path) => path === "/admin" || path === "/admin/",
  },
  {
    to: "/admin/contact",
    label: "İletişim Kutusu",
    icon: Inbox,
    match: (path) => path.startsWith("/admin/contact"),
  },
  {
    to: "/admin/projects",
    label: "Proje Haritası",
    icon: MapPinned,
    match: (path) => path.startsWith("/admin/projects"),
  },
];

export function AdminLayout({ children, title, subtitle, onLogout }: AdminLayoutProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const inboxUnread = useInboxUnreadCount();

  return (
    <div className="flex min-h-screen bg-[#090f1d] text-white">
      <aside className="flex w-60 shrink-0 flex-col border-r border-cyan/20 bg-[#0f1a2d]">
        <div className="border-b border-cyan/15 p-4">
          <div className="text-lg font-semibold tracking-wide">VEGA Yönetim Paneli</div>
          <p className="mt-1 text-xs text-white/45">Yerel Araçlar</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map(({ to, label, icon: Icon, match }) => {
            const active = match(pathname);
            const showInboxBadge = to === "/admin/contact" && inboxUnread > 0;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-cyan/20 text-cyan" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                <span className="min-w-0 flex-1">{label}</span>
                {showInboxBadge ? (
                  <span
                    className="shrink-0 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold text-black"
                    aria-label={`Okunmamış: ${inboxUnread}`}
                  >
                    {inboxUnread > 99 ? "99+" : inboxUnread}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-cyan/15 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-cyan/20 bg-[#0f1a2d]/80 px-6 py-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
