import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { hashScrollIntoViewOptions } from "@/utils/navigateToHashSection";

/**
 * Eski /iletisim bağlantıları: ana sayfadaki #iletisim bölümüne yönlendirir.
 * Ayrı kısa sayfa yerine tam ana sayfa kaydırması kullanılır.
 */
export const Route = createFileRoute("/iletisim")({
  component: IletisimRedirect,
});

function IletisimRedirect() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    navigate({
      to: "/",
      hash: "iletisim",
      replace: true,
      resetScroll: false,
      hashScrollIntoView: hashScrollIntoViewOptions(),
    });
  }, [navigate]);

  return (
    <div
      aria-hidden="true"
      style={{
        minHeight: "40vh",
        background: "var(--terminal-bg, #020608)",
      }}
    />
  );
}
