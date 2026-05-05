import { SCENE_POSITIONS } from "@/3d/sceneConstants";

export type SceneComponentType =
  | "AC_UNIT"
  | "HEAT_PUMP"
  | "BOILER"
  | "FLOOR_HEATING"
  | "RADIATOR"
  | "OTHER";

export interface SceneComponent {
  id: string;
  label: string;
  type: SceneComponentType;
  linkedProductId: string | null;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  visible: boolean;
  thumbnail?: string;
}

const STORAGE_KEY = "vega_scene_components";
// Bump this whenever defaults change so stale localStorage is auto-reset.
const SCHEMA_VERSION = 2;

const defaults: SceneComponent[] = [
  {
    id: "heatpump",
    label: "Isı Pompası",
    type: "HEAT_PUMP",
    linkedProductId: "p-heatpump-daikin",
    position: SCENE_POSITIONS.HEATPUMP,
    rotation: { x: 0, y: Math.PI / 6, z: 0 },
    visible: true,
  },
  {
    id: "ac-units",
    label: "İç Ünite Klimalar",
    type: "AC_UNIT",
    linkedProductId: "p-ac-daikin",
    position: SCENE_POSITIONS.AC_UNIT_SALON,
    rotation: { x: 0, y: 0, z: 0 },
    visible: true,
  },
  {
    id: "fire-system",
    label: "Yangın Sistemi",
    type: "OTHER",
    linkedProductId: "p-fire-tyco",
    position: SCENE_POSITIONS.FIRE_SYSTEM,
    rotation: { x: 0, y: 0, z: 0 },
    visible: true,
  },
  {
    id: "boiler",
    label: "Kombi",
    type: "BOILER",
    linkedProductId: "p-boiler-buderus",
    position: SCENE_POSITIONS.BOILER,
    rotation: { x: 0, y: 0, z: 0 },
    visible: true,
  },
  {
    id: "tank",
    label: "Tampon Tank",
    type: "OTHER",
    linkedProductId: "p-tank-kodsan",
    position: SCENE_POSITIONS.TANK,
    rotation: { x: 0, y: 0, z: 0 },
    visible: true,
  },
  {
    id: "pump",
    label: "Sirkülasyon Pompası",
    type: "OTHER",
    linkedProductId: "p-pump-lowara",
    position: SCENE_POSITIONS.PUMP,
    rotation: { x: 0, y: 0, z: 0 },
    visible: true,
  },
  {
    id: "manifold",
    label: "Kollektör",
    type: "OTHER",
    linkedProductId: "p-valve-caleffi",
    position: SCENE_POSITIONS.MANIFOLD,
    rotation: { x: 0, y: 0, z: 0 },
    visible: true,
  },
  {
    id: "underfloor",
    label: "Yerden Isıtma",
    type: "FLOOR_HEATING",
    linkedProductId: "p-pipe-frankische",
    position: { x: 0, y: SCENE_POSITIONS.UNDERFLOOR_Y, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    visible: true,
  },
  {
    id: "radiators",
    label: "Radyatörler",
    type: "RADIATOR",
    linkedProductId: "p-radiator-eca",
    position: SCENE_POSITIONS.RADIATOR_POSITIONS[0],
    rotation: { x: 0, y: 0, z: 0 },
    visible: true,
  },
];

const isBrowser = () => typeof window !== "undefined";

const cloneDefaults = (): SceneComponent[] =>
  defaults.map((item) => ({
    ...item,
    // Normalise Vector3 defaults → plain objects for clean serialisation
    position: { x: item.position.x, y: item.position.y, z: item.position.z },
    rotation: { x: item.rotation.x, y: item.rotation.y, z: item.rotation.z },
  }));

interface StorageEnvelope {
  version: number;
  data: SceneComponent[];
}

const readRaw = (): SceneComponent[] => {
  if (!isBrowser()) return cloneDefaults();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = cloneDefaults();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: SCHEMA_VERSION, data: seeded } satisfies StorageEnvelope)
    );
    return seeded;
  }
  try {
    const envelope = JSON.parse(raw) as Partial<StorageEnvelope>;
    // Version mismatch → nuke stale data and re-seed from current defaults
    if (!Array.isArray(envelope.data) || envelope.version !== SCHEMA_VERSION) {
      const seeded = cloneDefaults();
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: SCHEMA_VERSION, data: seeded } satisfies StorageEnvelope)
      );
      return seeded;
    }
    return envelope.data;
  } catch {
    return cloneDefaults();
  }
};

const writeRaw = (items: SceneComponent[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: SCHEMA_VERSION, data: items } satisfies StorageEnvelope)
  );
};

export const sceneComponentService = {
  getAll: (): SceneComponent[] => readRaw(),
  getById: (id: string): SceneComponent | null => readRaw().find((item) => item.id === id) ?? null,
  upsert: (component: SceneComponent): SceneComponent => {
    const current = readRaw();
    const idx = current.findIndex((item) => item.id === component.id);
    if (idx === -1) {
      current.push(component);
    } else {
      current[idx] = component;
    }
    writeRaw(current);
    return component;
  },
  update: (id: string, updates: Partial<SceneComponent>): SceneComponent => {
    const current = readRaw();
    const idx = current.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Scene component not found");
    const next = { ...current[idx], ...updates, id };
    current[idx] = next;
    writeRaw(current);
    return next;
  },
  reset: (): void => {
    writeRaw(cloneDefaults());
  },
};

export const SCENE_COMPONENTS_STORAGE_KEY = STORAGE_KEY;
