export type ContactSubmissionType = "quote" | "contact" | "product-quote";

export interface ContactSubmission {
  id: string;
  type: ContactSubmissionType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  category?: string;
  cartItems?: { productName: string; qty: number }[];
  submittedAt: string;
  read: boolean;
}

export type NewContactSubmission = Omit<ContactSubmission, "id" | "submittedAt" | "read"> & {
  read?: boolean;
};

const STORAGE_KEY = "vega_contact_submissions";

const isBrowser = () => typeof window !== "undefined";

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `c-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

function notifyInboxUpdated() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("vega-contact-inbox-updated"));
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function parseCartItemsFromLegacy(lines: unknown): { productName: string; qty: number }[] | undefined {
  if (!Array.isArray(lines) || lines.length === 0) return undefined;
  const out: { productName: string; qty: number }[] = [];
  for (const line of lines) {
    if (!isRecord(line)) continue;
    const brand = typeof line.brand === "string" ? line.brand : "";
    const name = typeof line.name === "string" ? line.name : "";
    const productName = [brand, name].filter(Boolean).join(" — ").trim() || "Ürün";
    const qtyRaw = line.qty;
    const qty = typeof qtyRaw === "number" && !Number.isNaN(qtyRaw) ? qtyRaw : Number(qtyRaw) || 1;
    out.push({ productName, qty });
  }
  return out.length ? out : undefined;
}

function legacyTypeFromSource(source: string): ContactSubmissionType {
  if (source === "cart_quote") return "quote";
  if (source === "product_detail") return "product-quote";
  return "contact";
}

function buildLegacyMessage(r: Record<string, unknown>): string | undefined {
  const parts: string[] = [];
  if (typeof r.notes === "string" && r.notes.trim()) parts.push(r.notes.trim());
  const meta: string[] = [];
  const add = (label: string, key: string) => {
    const v = r[key];
    if (typeof v === "string" && v.trim()) meta.push(`${label}: ${v.trim()}`);
  };
  add("Proje türü", "projectType");
  add("Konum", "location");
  add("Alan", "area");
  add("Zaman çizelgesi", "timeline");
  if (meta.length) parts.push(meta.join("\n"));
  if (parts.length === 0) return undefined;
  return parts.join("\n\n");
}

/** Parses one row from localStorage; supports current shape and pre-migration rows. */
function parseRow(raw: unknown): ContactSubmission | null {
  if (!isRecord(raw)) return null;

  if (
    typeof raw.id === "string" &&
    typeof raw.submittedAt === "string" &&
    typeof raw.type === "string" &&
    typeof raw.name === "string" &&
    typeof raw.email === "string"
  ) {
    const t = raw.type;
    if (t !== "quote" && t !== "contact" && t !== "product-quote") return null;
    let cartItems: ContactSubmission["cartItems"];
    if (Array.isArray(raw.cartItems)) {
      cartItems = [];
      for (const item of raw.cartItems) {
        if (!isRecord(item)) continue;
        const productName =
          typeof item.productName === "string" && item.productName.trim()
            ? item.productName.trim()
            : "Ürün";
        const qtyRaw = item.qty;
        const qty = typeof qtyRaw === "number" && !Number.isNaN(qtyRaw) ? qtyRaw : Number(qtyRaw) || 1;
        cartItems.push({ productName, qty });
      }
      if (cartItems.length === 0) cartItems = undefined;
    }
    return {
      id: raw.id,
      type: t,
      name: raw.name,
      email: raw.email,
      phone: typeof raw.phone === "string" ? raw.phone : undefined,
      company: typeof raw.company === "string" ? raw.company : undefined,
      message: typeof raw.message === "string" ? raw.message : undefined,
      category: typeof raw.category === "string" ? raw.category : undefined,
      cartItems,
      submittedAt: raw.submittedAt,
      read: Boolean(raw.read),
    };
  }

  if (typeof raw.id === "string" && typeof raw.createdAt === "string" && typeof raw.source === "string") {
    const type = legacyTypeFromSource(raw.source);
    return {
      id: raw.id,
      type,
      name: typeof raw.name === "string" ? raw.name : "",
      email: typeof raw.email === "string" ? raw.email : "",
      phone: typeof raw.phone === "string" ? raw.phone : undefined,
      company: typeof raw.company === "string" ? raw.company : undefined,
      message: buildLegacyMessage(raw),
      category: undefined,
      cartItems: parseCartItemsFromLegacy(raw.cartLines),
      submittedAt: raw.createdAt,
      read: false,
    };
  }

  return null;
}

const read = (): ContactSubmission[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(parseRow).filter((row): row is ContactSubmission => row !== null);
  } catch {
    return [];
  }
};

const write = (rows: ContactSubmission[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
};

const sortByDateDesc = (rows: ContactSubmission[]) =>
  [...rows].sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));

export const contactService = {
  getAll: (): ContactSubmission[] => sortByDateDesc(read()),

  getUnreadCount: (): number => read().filter((r) => !r.read).length,

  create: (payload: NewContactSubmission): ContactSubmission => {
    const row: ContactSubmission = {
      type: payload.type,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      message: payload.message,
      category: payload.category,
      cartItems: payload.cartItems,
      read: payload.read ?? false,
      id: generateId(),
      submittedAt: new Date().toISOString(),
    };
    write([row, ...read()]);
    notifyInboxUpdated();
    return row;
  },

  markRead: (id: string): void => {
    const rows = read();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) return;
    rows[idx] = { ...rows[idx], read: true };
    write(rows);
    notifyInboxUpdated();
  },

  setRead: (id: string, isRead: boolean): void => {
    write(read().map((r) => (r.id === id ? { ...r, read: isRead } : r)));
    notifyInboxUpdated();
  },

  markAllRead: (): void => {
    write(read().map((r) => ({ ...r, read: true })));
    notifyInboxUpdated();
  },

  delete: (id: string): void => {
    write(read().filter((r) => r.id !== id));
    notifyInboxUpdated();
  },
};

export const CONTACT_SUBMISSIONS_STORAGE_KEY = STORAGE_KEY;

export const CONTACT_TYPE_LABEL_TR: Record<ContactSubmissionType, string> = {
  quote: "Teklif (sepet)",
  contact: "İletişim",
  "product-quote": "Ürün teklifi",
};
