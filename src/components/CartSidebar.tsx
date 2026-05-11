import { useState } from "react";
import { useCart } from "@/providers/CartContext";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import ProjectQuoteDialog from "./ProjectQuoteDialog";
import { useLanguage } from "@/i18n/LanguageContext";

const CartSidebar = () => {
  const { items, isOpen, closeCart, remove, setQty, count, clear } = useCart();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const { t, lang } = useLanguage();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-overlay${isOpen ? " open" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-premium-drawer${isOpen ? " open" : ""}`}
        aria-label={t("cart.title")}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          style={{
            padding: "1.375rem 1.5rem",
            borderBottom: "1px solid rgba(10,22,40,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <ShoppingBag
            size={20}
            style={{ color: "var(--navy-primary)" }}
            aria-hidden="true"
          />
          <span
            style={{
              fontFamily: "var(--font-premium-display)",
              fontWeight: 800,
              fontSize: "1.125rem",
              color: "var(--navy-primary)",
              flex: 1,
            }}
          >
            {t("cart.title")}
          </span>
          {count > 0 && (
            <span
              style={{
                fontFamily: "var(--font-premium-mono)",
                fontSize: "0.75rem",
                color: "#7a8899",
              }}
            >
              {count} {t("cart.items")}
            </span>
          )}
          <button
            type="button"
            onClick={closeCart}
            aria-label="Kapat"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "1px solid rgba(10,22,40,0.1)",
              background: "transparent",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              color: "var(--navy-primary)",
              transition: "all 0.2s",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Items */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                gap: "0.75rem",
              }}
            >
              <ShoppingBag
                size={40}
                style={{ color: "rgba(10,22,40,0.15)" }}
                aria-hidden="true"
              />
              <p
                style={{
                  fontFamily: "var(--font-premium-body)",
                  fontSize: "0.9375rem",
                  color: "#7a8899",
                }}
              >
                {t("cart.empty")}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-premium-body)",
                  fontSize: "0.8125rem",
                  color: "#aab4bc",
                }}
              >
                {t("cart.empty.hint")}
              </p>
            </div>
          ) : (
            items.map(({ product, qty }) => {
              const name = lang === "tr" ? product.name : product.name_en;
              return (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    gap: "0.875rem",
                    alignItems: "flex-start",
                    padding: "0.875rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(10,22,40,0.07)",
                    background: "var(--off-white)",
                    position: "relative",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "rgba(10,22,40,0.06)",
                    }}
                  >
                    <img
                      src={product.image}
                      alt=""
                      decoding="async"
                      loading="lazy"
                      fetchPriority="low"
                      draggable={false}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-premium-mono)",
                        fontSize: "0.625rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#7a8899",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {product.brand}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-premium-display)",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        color: "var(--navy-primary)",
                        lineHeight: 1.3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-premium-mono)",
                        fontSize: "0.6875rem",
                        letterSpacing: "0.1em",
                        color: "var(--electric-cyan, #00f0ff)",
                        marginTop: "0.125rem",
                        opacity: 0.7,
                      }}
                    >
                      Teklif ile temin
                    </div>

                    {/* Qty controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setQty(product.id, qty - 1)}
                        aria-label="Azalt"
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "6px",
                          border: "1px solid rgba(10,22,40,0.15)",
                          background: "transparent",
                          cursor: "pointer",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--navy-primary)",
                        }}
                      >
                        <Minus size={11} />
                      </button>
                      <span
                        style={{
                          fontFamily: "var(--font-premium-mono)",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "var(--navy-primary)",
                          width: "1.5rem",
                          textAlign: "center",
                        }}
                      >
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(product.id, qty + 1)}
                        aria-label="Artır"
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "6px",
                          border: "1px solid rgba(10,22,40,0.15)",
                          background: "transparent",
                          cursor: "pointer",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--navy-primary)",
                        }}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    aria-label={`${name} kaldır`}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      color: "rgba(10,22,40,0.3)",
                      transition: "color 0.2s",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--cat-fire)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(10,22,40,0.3)";
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid rgba(10,22,40,0.08)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
          }}
        >
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => setQuoteOpen(true)}
            style={{
              width: "100%",
              padding: "0.875rem",
              borderRadius: "10px",
              border: "none",
              background: items.length === 0 ? "rgba(10,22,40,0.08)" : "var(--navy-primary)",
              color: items.length === 0 ? "#aab4bc" : "#fff",
              fontFamily: "var(--font-premium-display)",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: items.length === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s",
            }}
          >
            Teklif Talebi Oluştur
            <ArrowRight size={16} />
          </button>

          {items.length > 0 && (
            <button
              type="button"
              onClick={() => { clear(); closeCart(); }}
              style={{
                background: "transparent",
                border: "none",
                fontFamily: "var(--font-premium-body)",
                fontSize: "0.8125rem",
                color: "#7a8899",
                cursor: "pointer",
                textAlign: "center",
                padding: "0.25rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--navy-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#7a8899"; }}
            >
              Alışverişe Devam Et
            </button>
          )}
        </div>
      </aside>

      <ProjectQuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
};

export default CartSidebar;
