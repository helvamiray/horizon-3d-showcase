import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link } from "@tanstack/react-router";
import { type AdminProduct } from "@/lib/adminProductService";
import { sceneComponentService, type SceneComponent } from "@/lib/sceneComponentService";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAdminMergedProductRows } from "@/lib/productService";

const ADMIN_AUTH_KEY = "vega_admin_authed";

const SceneAdminPage = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [components, setComponents] = useState<SceneComponent[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [editing, setEditing] = useState<SceneComponent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsAuthed(window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "1");
    setComponents(sceneComponentService.getAll());
    setProducts(getAdminMergedProductRows());
  }, []);

  const refresh = () => setComponents(sceneComponentService.getAll());

  const linkedProductMap = useMemo(
    () => new Map(products.map((product) => [product.id, product.name])),
    [products]
  );

  const onPosChange = (
    id: string,
    axis: "x" | "y" | "z",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) return;
    const current = components.find((item) => item.id === id);
    if (!current) return;
    sceneComponentService.update(id, {
      position: { ...current.position, [axis]: value },
    });
    refresh();
  };

  const onVisibleChange = (id: string, visible: boolean) => {
    sceneComponentService.update(id, { visible });
    refresh();
  };

  const saveEdit = () => {
    if (!editing) return;
    sceneComponentService.upsert(editing);
    setEditing(null);
    refresh();
  };

  const logout = () => {
    if (typeof window !== "undefined") window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
    window.location.href = "/admin";
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#090f1d] text-white p-6">
        <div className="rounded-xl border border-cyan/30 bg-[#0f1a2d] p-6">
          <p>Yönetici oturumu gerekli.</p>
          <Link to="/admin" className="mt-3 inline-block text-cyan underline">
            /admin giriş sayfasına git
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <AdminLayout
      title="3D Sahne Yönetimi"
      subtitle="Kaydet ve sayfayı yenileyerek sonucu kontrol edin."
      onLogout={logout}
    >
      <div className="p-6 space-y-6">
        <div className="rounded-xl border border-cyan/25 bg-[#0c1526]/80 p-4 text-sm text-white/85">
          <h3 className="text-base font-semibold text-cyan mb-2 tracking-wide">RULES</h3>
          <ul className="list-disc space-y-1 pl-5 text-white/75">
            <li>Do not touch Villa3D or any public-facing components</li>
            <li>
              All pages check sessionStorage <code className="text-cyan/90">vega_admin_authed === &quot;1&quot;</code>
            </li>
            <li>TypeScript strict — no any types</li>
            <li>npm run build must pass with zero errors</li>
          </ul>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[1200px] text-sm">
          <thead className="bg-[#0f1a2d] text-white/70">
            <tr>
              <th className="p-3 text-left">Bileşen ID</th>
              <th className="p-3 text-left">Etiket</th>
              <th className="p-3 text-left">Tür</th>
              <th className="p-3 text-left">Bağlı ürün</th>
              <th className="p-3 text-left">X</th>
              <th className="p-3 text-left">Y</th>
              <th className="p-3 text-left">Z</th>
              <th className="p-3 text-left">Görünür</th>
              <th className="p-3 text-left">Düzenle</th>
            </tr>
          </thead>
          <tbody>
            {components.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="p-3 font-mono text-xs">{item.id}</td>
                <td className="p-3">{item.label}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">{item.linkedProductId ? linkedProductMap.get(item.linkedProductId) ?? item.linkedProductId : "-"}</td>
                <td className="p-3">
                  <input className="w-20 rounded border border-white/20 bg-[#0c1526] px-2 py-1" type="number" step="0.5" value={item.position.x} onChange={(e) => onPosChange(item.id, "x", e)} />
                </td>
                <td className="p-3">
                  <input className="w-20 rounded border border-white/20 bg-[#0c1526] px-2 py-1" type="number" step="0.5" value={item.position.y} onChange={(e) => onPosChange(item.id, "y", e)} />
                </td>
                <td className="p-3">
                  <input className="w-20 rounded border border-white/20 bg-[#0c1526] px-2 py-1" type="number" step="0.5" value={item.position.z} onChange={(e) => onPosChange(item.id, "z", e)} />
                </td>
                <td className="p-3">
                  <input type="checkbox" checked={item.visible} onChange={(e) => onVisibleChange(item.id, e.target.checked)} />
                </td>
                <td className="p-3">
                  <button type="button" className="rounded border border-white/20 px-2 py-1" onClick={() => setEditing(item)}>
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </AdminLayout>
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-cyan/30 bg-[#0f1a2d] p-6 space-y-4">
            <h2 className="text-xl font-semibold">{editing.id} — düzenle</h2>
            <label className="block space-y-1">
              <span className="text-sm text-white/70">Etiket</span>
              <input value={editing.label} onChange={(e) => setEditing((prev) => (prev ? { ...prev, label: e.target.value } : prev))} className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-white/70">Bağlı ürün</span>
              <select
                value={editing.linkedProductId ?? ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev
                      ? { ...prev, linkedProductId: e.target.value || null }
                      : prev
                  )
                }
                className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2"
              >
                <option value="">Yok</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-white/70">Önizleme görseli</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () =>
                    setEditing((prev) =>
                      prev ? { ...prev, thumbnail: String(reader.result ?? "") } : prev
                    );
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.visible}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, visible: e.target.checked } : prev
                  )
                }
              />
              <span>Görünür</span>
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded border border-white/20 px-3 py-2"
                onClick={() => setEditing(null)}
              >
                İptal
              </button>
              <button type="button" className="rounded bg-cyan px-3 py-2 text-black" onClick={saveEdit}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
  </>
  );
};

export default SceneAdminPage;
