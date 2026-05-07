export type MapProjectStatus = "tamamlandi" | "devam-ediyor" | "planlama";

export interface MapProject {
  id: string;
  city: string;
  cityLabel: string;
  district?: string;
  lat: number;
  lng: number;
  projectName: string;
  category: string; // klima | kazan | yangin | isi-pompasi | vrf | diger
  year: number;
  status: MapProjectStatus;
  description?: string;
  createdAt: string;
}

export const MAP_PROJECTS_STORAGE_KEY = "vega_map_projects";

const NOW = new Date().toISOString();
const SEED_PROJECTS: MapProject[] = [
  { id: "1", city: "istanbul", cityLabel: "İstanbul", lat: 41.0082, lng: 28.9784, projectName: "Maslak Plaza VRF Sistemi", category: "vrf", year: 2023, status: "tamamlandi", description: "12 kat, 48 iç ünite", createdAt: NOW },
  { id: "2", city: "ankara", cityLabel: "Ankara", lat: 39.9334, lng: 32.8597, projectName: "Hastane Merkezi Isıtma", category: "kazan", year: 2022, status: "tamamlandi", description: "2400 m² kazan dairesi", createdAt: NOW },
  { id: "3", city: "izmir", cityLabel: "İzmir", lat: 38.4189, lng: 27.1287, projectName: "Lojistik Soğuk Depo", category: "klima", year: 2022, status: "devam-ediyor", description: "-18°C soğuk oda", createdAt: NOW },
  { id: "4", city: "antalya", cityLabel: "Antalya", lat: 36.8969, lng: 30.7133, projectName: "5 Yıldızlı Otel HVAC", category: "vrf", year: 2021, status: "tamamlandi", description: "320 oda tam sistem", createdAt: NOW },
  { id: "5", city: "bursa", cityLabel: "Bursa", lat: 40.1885, lng: 29.061, projectName: "Fabrika Kazan Dairesi", category: "kazan", year: 2023, status: "planlama", description: "3x500 kW kazan", createdAt: NOW },
  { id: "6", city: "mugla", cityLabel: "Muğla", lat: 37.2153, lng: 28.3636, projectName: "Lüks Villa Isı Pompası", category: "isi-pompasi", year: 2023, status: "tamamlandi", description: "450 m² villa", createdAt: NOW },
  { id: "7", city: "konya", cityLabel: "Konya", lat: 37.8746, lng: 32.4932, projectName: "AVM Yangın Sistemi", category: "yangin", year: 2022, status: "tamamlandi", description: "18.000 m² sprinkler", createdAt: NOW },
  { id: "8", city: "gaziantep", cityLabel: "Gaziantep", lat: 37.0662, lng: 37.3833, projectName: "Endüstriyel Soğutma Tesisi", category: "klima", year: 2021, status: "devam-ediyor", description: "Chiller sistemi", createdAt: NOW },
  { id: "9", city: "trabzon", cityLabel: "Trabzon", lat: 41.0015, lng: 39.7178, projectName: "Otel Isıtma Sistemi", category: "isi-pompasi", year: 2023, status: "tamamlandi", description: "Deniz suyu kaynaklı", createdAt: NOW },
  { id: "10", city: "kayseri", cityLabel: "Kayseri", lat: 38.7312, lng: 35.4787, projectName: "Hastane Klima Merkezi", category: "klima", year: 2022, status: "planlama", description: "280 iç ünite", createdAt: NOW },
];

const isBrowser = () => typeof window !== "undefined";

const STATUSES: MapProjectStatus[] = ["tamamlandi", "devam-ediyor", "planlama"];

function normalizeProject(row: MapProject): MapProject {
  const status: MapProjectStatus =
    row.status && STATUSES.includes(row.status) ? row.status : "tamamlandi";
  return { ...row, status };
}

const read = (): MapProject[] => {
  if (!isBrowser()) return SEED_PROJECTS.map(normalizeProject);
  try {
    const raw = localStorage.getItem(MAP_PROJECTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MAP_PROJECTS_STORAGE_KEY, JSON.stringify(SEED_PROJECTS));
      return SEED_PROJECTS.map(normalizeProject);
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return SEED_PROJECTS.map(normalizeProject);
    return (parsed as MapProject[]).map(normalizeProject);
  } catch {
    return SEED_PROJECTS.map(normalizeProject);
  }
};

const MAP_PROJECTS_CHANGED_EVENT = "vega-map-projects-updated";

const notifyMapProjectsChanged = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(MAP_PROJECTS_CHANGED_EVENT));
};

const write = (data: MapProject[]) => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(MAP_PROJECTS_STORAGE_KEY, JSON.stringify(data));
    notifyMapProjectsChanged();
  } catch {}
};

/** Subscribe to local map project storage changes (same tab + other tabs). */
export function subscribeMapProjects(listener: () => void): () => void {
  if (!isBrowser()) return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === MAP_PROJECTS_STORAGE_KEY || e.key === null) listener();
  };
  const onCustom = () => listener();
  window.addEventListener("storage", onStorage);
  window.addEventListener(MAP_PROJECTS_CHANGED_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(MAP_PROJECTS_CHANGED_EVENT, onCustom);
  };
}

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `mp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const projectMapService = {
  getAll: (): MapProject[] => read(),
  create: (p: Omit<MapProject, "id" | "createdAt">): MapProject => {
    const created: MapProject = { ...p, id: generateId(), createdAt: new Date().toISOString() };
    write([...read(), created]);
    return created;
  },
  update: (id: string, updates: Partial<MapProject>): MapProject => {
    const all = read();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Not found");
    all[idx] = normalizeProject({ ...all[idx], ...updates });
    write(all);
    return all[idx];
  },
  delete: (id: string): void => write(read().filter((p) => p.id !== id)),
};
