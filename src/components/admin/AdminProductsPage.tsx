import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { productService, type AdminProduct, type ProductCurrency, type ProductSpec } from "@/lib/adminProductService";
import { CATEGORY_LABEL, type ProductCategory } from "@/data/products";
import { normalizeProductCategory } from "@/lib/productService";
import { AdminLayout } from "@/components/admin/AdminLayout";

const ADMIN_AUTH_KEY = "vega_admin_authed";

type FormState = {
  name: string;
  nameEn: string;
  slug: string;
  category: ProductCategory;
  brand: string;
  description: string;
  descriptionEn: string;
  shortDescription: string;
  price: string;
  currency: ProductCurrency;
  images: string[];
  imageUrlInput: string;
  specs: ProductSpec[];
  inStock: boolean;
  featured: boolean;
};

const emptyForm = (): FormState => ({
  name: "",
  nameEn: "",
  slug: "",
  category: "klima",
  brand: "",
  description: "",
  descriptionEn: "",
  shortDescription: "",
  price: "",
  currency: "TRY",
  images: [],
  imageUrlInput: "",
  specs: [{ key: "", value: "" }],
  inStock: true,
  featured: false,
});

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const toFormState = (product: AdminProduct): FormState => ({
  name: product.name,
  nameEn: product.nameEn ?? "",
  slug: product.slug,
  category: normalizeProductCategory(product.category),
  brand: product.brand,
  description: product.description,
  descriptionEn: product.descriptionEn ?? "",
  shortDescription: product.shortDescription,
  price: typeof product.price === "number" ? String(product.price) : "",
  currency: product.currency ?? "TRY",
  images: product.images,
  imageUrlInput: "",
  specs: product.specs.length > 0 ? product.specs : [{ key: "", value: "" }],
  inStock: product.inStock,
  featured: product.featured,
});

const formatMoney = (price?: number, currency?: ProductCurrency) => {
  if (typeof price !== "number") return "-";
  if (currency === "USD") return `$${price.toLocaleString("en-US")}`;
  if (currency === "EUR") return `EUR ${price.toLocaleString("de-DE")}`;
  return `₺ ${price.toLocaleString("tr-TR")}`;
};

const AdminProductsPage = () => {
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsAuthed(window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "1");
  }, []);

  const refresh = () => setProducts(productService.getAll());

  useEffect(() => {
    if (!isAuthed) return;
    refresh();
  }, [isAuthed]);

  const categories = useMemo(() => {
    const all = new Set<string>();
    products.forEach((p) => all.add(p.category));
    return Array.from(all).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (!q) return true;
      return `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q);
    });
  }, [products, search, categoryFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setForm(toFormState(product));
    setError(null);
    setFormOpen(true);
  };

  const validate = () => {
    if (!form.name.trim()) return "Ürün adı gerekli";
    if (!form.brand.trim()) return "Marka gerekli";
    if (!form.description.trim()) return "Açıklama gerekli";
    return null;
  };

  const handleSave = () => {
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    const payload = {
      name: form.name.trim(),
      nameEn: form.nameEn.trim() || undefined,
      slug: form.slug.trim() || slugify(form.name),
      category: form.category,
      brand: form.brand.trim(),
      description: form.description.trim(),
      descriptionEn: form.descriptionEn.trim() || undefined,
      shortDescription: form.shortDescription.trim(),
      price: form.price.trim() ? Number(form.price) : undefined,
      currency: form.currency,
      images: form.images,
      specs: form.specs.filter((s) => s.key.trim() || s.value.trim()),
      inStock: form.inStock,
      featured: form.featured,
    };

    if (editingId) {
      productService.update(editingId, payload);
    } else {
      productService.create(payload);
    }
    refresh();
    setFormOpen(false);
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const converted = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result ?? ""));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          })
      )
    );

    setForm((prev) => ({ ...prev, images: [...prev.images, ...converted] }));
  };

  const logout = () => {
    if (typeof window !== "undefined") window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthed(false);
    setPasswordInput("");
  };

  const login = (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === (import.meta.env.VITE_ADMIN_PASSWORD ?? "")) {
      if (typeof window !== "undefined") window.sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
      setIsAuthed(true);
      setPasswordInput("");
      return;
    }
    setError("Hatalı şifre, tekrar deneyin");
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#090f1d] text-white grid place-items-center p-6">
        <form onSubmit={login} className="w-full max-w-md rounded-xl border border-cyan/30 bg-[#0f1a2d] p-6 space-y-4">
          <h1 className="text-2xl font-semibold">VEGA Yönetim Paneli</h1>
          <p className="text-sm text-white/70">Devam etmek için şifrenizi girin.</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setError(null);
            }}
            className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
            placeholder="Yönetici Şifresi"
          />
          {error && <p className="text-sm text-amber-400">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-cyan px-3 py-2 font-medium text-black">
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
    <AdminLayout
      title="Ürün Yönetimi"
      subtitle="Ürünler yerel depolamada tutulur ve kataloga yansır"
      onLogout={logout}
    >
      <section className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İsim, marka veya kategori ara..."
                className="min-w-64 flex-1 rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABEL[normalizeProductCategory(c)]?.tr ?? c}
                  </option>
                ))}
              </select>
              <button type="button" onClick={openCreate} className="rounded-md bg-cyan px-3 py-2 text-black font-medium">
                Yeni Ürün Ekle
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="bg-[#0f1a2d] text-white/70">
                  <tr>
                    <th className="p-3 text-left">Görsel</th>
                    <th className="p-3 text-left">Ürün Adı</th>
                    <th className="p-3 text-left">Marka</th>
                    <th className="p-3 text-left">Kategori</th>
                    <th className="p-3 text-left">Fiyat</th>
                    <th className="p-3 text-left">Stok</th>
                    <th className="p-3 text-left">Düzenle</th>
                    <th className="p-3 text-left">Sil</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-t border-white/10">
                      <td className="p-3">
                        {p.images[0] ? <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-white/10" />}
                      </td>
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">{p.brand}</td>
                      <td className="p-3">{CATEGORY_LABEL[normalizeProductCategory(p.category)]?.tr ?? p.category}</td>
                      <td className="p-3">{formatMoney(p.price, p.currency)}</td>
                      <td className="p-3">{p.inStock ? "Stokta" : "Yok"}</td>
                      <td className="p-3">
                        <button type="button" onClick={() => openEdit(p)} className="rounded border border-white/20 px-2 py-1">
                          Düzenle
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
                            productService.delete(p.id);
                            refresh();
                          }}
                          className="rounded border border-red-400/40 px-2 py-1 text-red-300"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-white/60">
                        Ürün bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
    </AdminLayout>
      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-cyan/30 bg-[#0f1a2d] p-6">
            <h2 className="mb-4 text-xl font-semibold">{editingId ? "Ürünü Düzenle" : "Yeni Ürün"}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm text-white/70">Ad (TR) *</span>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                      ...(!editingId ? { slug: slugify(e.target.value) } : {}),
                    }))
                  }
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Ad (EN)</span>
                <input
                  value={form.nameEn}
                  onChange={(e) => setForm((prev) => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                  placeholder="Boşsa TR adı kullanılır"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">URL slug</span>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Katalog kategorisi *</span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value as ProductCategory }))
                  }
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                >
                  {(Object.keys(CATEGORY_LABEL) as ProductCategory[]).map((key) => (
                    <option key={key} value={key}>
                      {CATEGORY_LABEL[key].tr} — {CATEGORY_LABEL[key].en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Marka *</span>
                <input value={form.brand} onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))} className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm text-white/70">Kısa açıklama</span>
                <input value={form.shortDescription} onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))} className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm text-white/70">Açıklama (TR) *</span>
                <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={4} className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm text-white/70">Açıklama (EN)</span>
                <textarea
                  value={form.descriptionEn}
                  onChange={(e) => setForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                  rows={3}
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                  placeholder="Boşsa TR açıklama kullanılır"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Fiyat</span>
                <input value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} type="number" className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2" />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Para birimi</span>
                <select value={form.currency} onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value as ProductCurrency }))} className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2">
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm text-white/70">Görseller</div>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
              <div className="flex gap-2">
                <input
                  value={form.imageUrlInput}
                  onChange={(e) => setForm((prev) => ({ ...prev, imageUrlInput: e.target.value }))}
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                  placeholder="Görsel URL"
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = form.imageUrlInput.trim();
                    if (!trimmed) return;
                    setForm((prev) => ({
                      ...prev,
                      images: [...prev.images, trimmed],
                      imageUrlInput: "",
                    }));
                  }}
                  className="rounded border border-white/20 px-3 py-2 text-sm"
                >
                  URL Ekle
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.images.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img src={src} alt={`Uploaded ${idx + 1}`} className="h-16 w-16 rounded object-cover" />
                    <button
                      type="button"
                      className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-black/80 text-xs"
                      onClick={() => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Teknik özellikler</div>
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: "", value: "" }] }))} className="rounded border border-white/20 px-2 py-1 text-xs">
                  Özellik ekle
                </button>
              </div>
              {form.specs.map((spec, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input
                    value={spec.key}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        specs: prev.specs.map((s, i) => (i === idx ? { ...s, key: e.target.value } : s)),
                      }))
                    }
                    placeholder="Anahtar"
                    className="rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                  />
                  <input
                    value={spec.value}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        specs: prev.specs.map((s, i) => (i === idx ? { ...s, value: e.target.value } : s)),
                      }))
                    }
                    placeholder="Değer"
                    className="rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        specs: prev.specs.length === 1 ? [{ key: "", value: "" }] : prev.specs.filter((_, i) => i !== idx),
                      }))
                    }
                    className="rounded border border-white/20 px-2"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((prev) => ({ ...prev, inStock: e.target.checked }))} />
                <span>Stokta</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))} />
                <span>Öne çıkan</span>
              </label>
            </div>

            {error && <p className="mt-4 text-sm text-amber-300">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-md border border-white/20 px-3 py-2">
                İptal
              </button>
              <button type="button" onClick={handleSave} className="rounded-md bg-cyan px-3 py-2 text-black font-medium">
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
  </>
  );
};

export default AdminProductsPage;
