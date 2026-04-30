import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Sayfa bulunamadı</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Ana sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VEGA Mühendislik · Akıllı HVAC ve Enerji Sistemleri" },
      { name: "description", content: "VEGA — premium HVAC, ısı pompası ve enerji sistemleri. Akıllı bir villanın interaktif 3D dijital ikizini keşfedin." },
      { name: "author", content: "VEGA Engineering" },
      { property: "og:title", content: "VEGA Mühendislik" },
      { property: "og:description", content: "Akıllı HVAC, ısı pompası ve enerji sistemleri — interaktif 3D dijital ikiz." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Outlet />
        <CartSidebar />
        <Toaster />
      </CartProvider>
    </LanguageProvider>
  );
}
