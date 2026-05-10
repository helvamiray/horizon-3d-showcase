import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  projectMapService,
  subscribeMapProjects,
  type MapProject,
  type MapProjectStatus,
} from "@/lib/projectMapService";

function mapLocationLabel(p: MapProject): string {
  const d = p.district?.trim();
  if (d) return `${p.cityLabel} / ${d}`;
  return p.cityLabel;
}

function MapStatusLine({ status }: { status: MapProjectStatus }) {
  if (status === "tamamlandi") {
    return (
      <div style={{ color: "#22c55e", fontSize: "12px", fontWeight: 600, marginTop: "6px" }}>
        Tamamlandı
      </div>
    );
  }
  if (status === "devam-ediyor") {
    return (
      <div style={{ color: "#ca8a04", fontSize: "12px", fontWeight: 600, marginTop: "6px" }}>
        Devam ediyor
      </div>
    );
  }
  return (
    <div style={{ color: "#9ca3af", fontSize: "12px", fontWeight: 600, marginTop: "6px" }}>
      Planlama
    </div>
  );
}

/** Yüksek kontrast kategori paleti — filtre + harita pinleri senkron */
export const MAP_CATEGORY_PALETTE: Record<string, { pin: string; text: string; textBright: string }> = {
  klima: { pin: "#06b6d4", text: "#06b6d4", textBright: "#22d3ee" },
  vrf: { pin: "#f59e0b", text: "#f59e0b", textBright: "#fbbf24" },
  kazan: { pin: "#84cc16", text: "#84cc16", textBright: "#a3e635" },
  "isi-pompasi": { pin: "#a855f7", text: "#a855f7", textBright: "#c084fc" },
  yangin: { pin: "#f43f5e", text: "#f43f5e", textBright: "#fb7185" },
  diger: { pin: "#94a3b8", text: "#94a3b8", textBright: "#e2e8f0" },
  all: { pin: "#cbd5e1", text: "#cbd5e1", textBright: "#f8fafc" },
};

const FILTER_IDS = ["all", "klima", "vrf", "kazan", "isi-pompasi", "yangin", "diger"] as const;
type FilterId = (typeof FILTER_IDS)[number];

const categoryLabels: Record<FilterId, string> = {
  all: "Tümü",
  klima: "Klima",
  vrf: "VRF",
  kazan: "Kazan",
  "isi-pompasi": "Isı Pompası",
  yangin: "Yangın",
  diger: "Diğer",
};

function paletteFor(cat: string): (typeof MAP_CATEGORY_PALETTE)["diger"] {
  return MAP_CATEGORY_PALETTE[cat] ?? MAP_CATEGORY_PALETTE.diger;
}

/** Tümü: projeye göre gerçek kategori rengi; tek filtre: seçilen kategori rengine boya */
function pinColors(project: MapProject, activeFilter: FilterId): { color: string; fillColor: string } {
  const projectPalette = paletteFor(project.category);
  if (activeFilter === "all") {
    return { color: projectPalette.pin, fillColor: projectPalette.pin };
  }
  const accent = paletteFor(activeFilter).pin;
  return { color: accent, fillColor: accent };
}

function TurkeyMapLeaflet() {
  const reduceMotion = useReducedMotion();
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [activeCategory, setActiveCategory] = useState<FilterId>("all");
  const [hoveredCategory, setHoveredCategory] = useState<FilterId | null>(null);

  useEffect(() => {
    const load = () => {
      const list = projectMapService.getAll();
      setProjects([...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    };
    load();
    return subscribeMapProjects(load);
  }, []);

  const filtered = useMemo(() => {
    return activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  const chipTransition = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 440, damping: 34 };

  return (
    <section className="map-section" id="projeler">
      <div className="map-header">
        <h2 className="map-title">
          Türkiye Genelinde
          <br />
          <span className="map-title-count">{projects.length}+ Proje</span>
        </h2>

        <div className="map-filters">
          <AnimatePresence initial={false} mode="popLayout">
            {FILTER_IDS.map((cat) => {
              const pal = paletteFor(cat);
              const isActive = activeCategory === cat;
              const isHovered = hoveredCategory === cat;
              const isLit = isActive || isHovered;

              return (
                <motion.button
                  key={cat}
                  layout
                  type="button"
                  className={`map-chip map-chip--palette ${isActive ? "active" : ""}`}
                  data-map-cat={cat}
                  onClick={() => setActiveCategory(cat)}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  initial={false}
                  style={{
                    textShadow: isLit ? `0 0 16px ${pal.pin}aa, 0 0 32px ${pal.pin}55` : undefined,
                  }}
                  animate={{
                    color: isLit ? pal.textBright : pal.text,
                    scale: isActive ? 1.03 : 1,
                    borderColor: isLit ? `${pal.pin}66` : "rgba(148, 163, 184, 0.22)",
                    boxShadow: isLit
                      ? `0 1px 0 rgba(255,255,255,0.1) inset, 0 0 0 1px ${pal.pin}44, 0 10px 28px rgba(0,0,0,0.38), 0 0 26px ${pal.pin}33`
                      : "0 1px 0 rgba(255,255,255,0.06) inset",
                  }}
                  transition={chipTransition}
                  whileHover={
                    reduceMotion ? undefined : { scale: isActive ? 1.04 : 1.02, transition: { duration: 0.18 } }
                  }
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  {categoryLabels[cat]}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="map-container-wrapper"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.32 }}
      >
        <MapContainer
          center={[39.0, 35.0]}
          zoom={6}
          scrollWheelZoom={false}
          className="leaflet-map"
          style={{ height: "500px", width: "100%", borderRadius: "16px" }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {filtered.map((project) => {
            const { color, fillColor } = pinColors(project, activeCategory);
            return (
              <CircleMarker
                key={`${activeCategory}-${project.id}`}
                center={[project.lat, project.lng]}
                radius={10}
                pathOptions={{
                  color,
                  fillColor,
                  fillOpacity: 0.88,
                  weight: 2,
                }}
              >
                <Popup className="map-popup">
                  <div className="popup-content">
                    <strong>{mapLocationLabel(project)}</strong>
                    <p style={{ margin: "6px 0 0", fontWeight: 600 }}>{project.projectName}</p>
                    <span style={{ display: "block", marginTop: "4px", fontSize: "12px", opacity: 0.9 }}>
                      {project.year}
                    </span>
                    <MapStatusLine status={project.status} />
                    {project.description?.trim() ? (
                      <small style={{ display: "block", marginTop: "10px", lineHeight: 1.45 }}>
                        <span style={{ display: "block", fontWeight: 600, marginBottom: "4px", opacity: 0.9 }}>
                          Tamamlanan işler
                        </span>
                        {project.description}
                      </small>
                    ) : null}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </motion.div>
    </section>
  );
}

export function TurkeyMapLive() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <TurkeyMapLeaflet />;
}

export default TurkeyMapLive;
