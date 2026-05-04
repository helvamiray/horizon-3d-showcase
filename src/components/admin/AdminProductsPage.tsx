import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { productService, type AdminProduct, type ProductCurrency, type ProductSpec } from "@/lib/adminProductService";

const ADMIN_AUTH_KEY = "vega_admin_authed";

type FormState = {
  name: string;
  slug: string;
  category: string;
  brand: string;
  description: string;
  shortDescription: string;
  price: string;
  currency: ProductCurrency;
  images: string[];
  specs: ProductSpec[];
  inStock: boolean;
  featured: boolean;
};

const emptyForm = (): FormState => ({
  name: "",
  slug: "",
  category: "",
  brand: "",
  description: "",
  shortDescription: "",
  price: "",
  currency: "TRY",
  images: [],
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
  slug: product.slug,
  category: product.category,
  brand: product.brand,
  description: product.description,
  shortDescription: product.shortDescription,
  price: typeof product.price === "number" ? String(product.price) : "",
  currency: product.currency ?? "TRY",
  images: product.images,
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
  const [activeNav, setActiveNav] = useState("products");
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
    if (!form.name.trim()) return "Name is required";
    if (!form.category.trim()) return "Category is required";
    if (!form.brand.trim()) return "Brand is required";
    if (!form.description.trim()) return "Description is required";
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
      slug: form.slug.trim() || slugify(form.name),
      category: form.category.trim(),
      brand: form.brand.trim(),
      description: form.description.trim(),
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
    setError("Invalid password");
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#090f1d] text-white grid place-items-center p-6">
        <form onSubmit={login} className="w-full max-w-md rounded-xl border border-cyan/30 bg-[#0f1a2d] p-6 space-y-4">
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="text-sm text-white/70">Enter password to continue.</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setError(null);
            }}
            className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
            placeholder="Password"
          />
          {error && <p className="text-sm text-amber-400">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-cyan px-3 py-2 font-medium text-black">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090f1d] text-white">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-cyan/20 bg-[#0f1a2d] p-4">
          <div className="mb-8 text-lg font-semibold tracking-wide">VEGA Admin</div>
          <nav className="space-y-2">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "products", label: "Products" },
              { id: "orders", label: "Orders (Soon)" },
              { id: "settings", label: "Settings (Soon)" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`w-full rounded-md px-3 py-2 text-left ${activeNav === item.id ? "bg-cyan/20 text-cyan" : "text-white/70 hover:bg-white/5"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="flex items-center justify-between border-b border-cyan/20 bg-[#0f1a2d]/70 px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold">Product Management</h1>
              <p className="text-sm text-white/60">Local storage mode (no backend)</p>
            </div>
            <button type="button" onClick={logout} className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
              Logout
            </button>
            <Link to="/admin/scene" className="rounded-md border border-cyan/30 px-3 py-2 text-sm text-cyan hover:bg-cyan/10">
              3D Sahne Yönetimi
            </Link>
          </header>

          <section className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, brand, category..."
                className="min-w-64 flex-1 rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button type="button" onClick={openCreate} className="rounded-md bg-cyan px-3 py-2 text-black font-medium">
                Add New Product
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="bg-[#0f1a2d] text-white/70">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Brand</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Stock</th>
                    <th className="p-3 text-left">Featured</th>
                    <th className="p-3 text-left">Actions</th>
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
                      <td className="p-3">{p.category}</td>
                      <td className="p-3">{formatMoney(p.price, p.currency)}</td>
                      <td className="p-3">{p.inStock ? "In Stock" : "Out of Stock"}</td>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={p.featured}
                          onChange={(e) => {
                            productService.update(p.id, { featured: e.target.checked });
                            refresh();
                          }}
                        />
                      </td>
                      <td className="p-3 space-x-2">
                        <button type="button" onClick={() => openEdit(p)} className="rounded border border-white/20 px-2 py-1">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm(`Delete "${p.name}"?`)) return;
                            productService.delete(p.id);
                            refresh();
                          }}
                          className="rounded border border-red-400/40 px-2 py-1 text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-white/60">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-cyan/30 bg-[#0f1a2d] p-6">
            <h2 className="mb-4 text-xl font-semibold">{editingId ? "Edit Product" : "Add Product"}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm text-white/70">Name *</span>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: slugify(e.target.value),
                    }))
                  }
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Slug</span>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                  className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Category *</span>
                <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2" />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Brand *</span>
                <input value={form.brand} onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))} className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm text-white/70">Short Description</span>
                <input value={form.shortDescription} onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))} className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2" />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm text-white/70">Description *</span>
                <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={4} className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2" />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Price</span>
                <input value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} type="number" className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2" />
              </label>
              <label className="space-y-1">
                <span className="text-sm text-white/70">Currency</span>
                <select value={form.currency} onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value as ProductCurrency }))} className="w-full rounded-md border border-white/20 bg-[#0c1526] px-3 py-2">
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm text-white/70">Images</div>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
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
                <div className="text-sm text-white/70">Technical Specs</div>
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: "", value: "" }] }))} className="rounded border border-white/20 px-2 py-1 text-xs">
                  Add Spec
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
                    placeholder="Key"
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
                    placeholder="Value"
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
                <span>In Stock</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))} />
                <span>Featured</span>
              </label>
            </div>

            {error && <p className="mt-4 text-sm text-amber-300">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-md border border-white/20 px-3 py-2">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="rounded-md bg-cyan px-3 py-2 text-black font-medium">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
