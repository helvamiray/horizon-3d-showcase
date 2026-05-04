import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link } from "@tanstack/react-router";
import { type AdminProduct, productService } from "@/lib/adminProductService";
import { sceneComponentService, type SceneComponent } from "@/lib/sceneComponentService";

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
    setProducts(productService.getAll());
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

  if (!isAuthed) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#090f1d] text-white p-6">
        <div className="rounded-xl border border-cyan/30 bg-[#0f1a2d] p-6">
          <p>Admin authentication required.</p>
          <Link to="/admin" className="mt-3 inline-block text-cyan underline">
            /admin login sayfasına git
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090f1d] text-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">3D Sahne Yönetimi</h1>
          <p className="text-sm text-white/60">Kaydet ve sayfayı yenileyerek sonucu kontrol edin.</p>
        </div>
        <Link to="/admin" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
          Products Admin
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[1200px] text-sm">
          <thead className="bg-[#0f1a2d] text-white/70">
            <tr>
              <th className="p-3 text-left">Component ID</th>
              <th className="p-3 text-left">Label</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Linked Product</th>
              <th className="p-3 text-left">X</th>
              <th className="p-3 text-left">Y</th>
              <th className="p-3 text-left">Z</th>
              <th className="p-3 text-left">Visible</th>
              <th className="p-3 text-left">Edit</th>
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
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-cyan/30 bg-[#0f1a2d] p-6 space-y-4">
            <h2 className="text-xl font-semibold">{editing.id} düzenle</h2>
            <label className="block space-y-1">
              <span className="text-sm text-white/70">Label</span>
              <input value={editing.label} onChange={(e) => setEditing((prev) => (prev ? { ...prev, label: e.target.value } : prev))} className="w-full rounded border border-white/20 bg-[#0c1526] px-3 py-2" />
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-white/70">Linked Product</span>
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
                <option value="">None</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-white/70">Thumbnail</span>
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
              <span>Visible</span>
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded border border-white/20 px-3 py-2"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button type="button" className="rounded bg-cyan px-3 py-2 text-black" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SceneAdminPage;
