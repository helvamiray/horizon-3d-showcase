import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { projectMapService, subscribeMapProjects, type MapProject, type MapProjectStatus } from "@/lib/projectMapService";

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

const CATEGORY_COLORS: Record<string, string> = {
  klima: "#00d4ff",
  vrf: "#00d4ff",
  kazan: "#ffbf00",
  "isi-pompasi": "#00ff88",
  yangin: "#ff4444",
  diger: "#a0a0a0",
};

export function TurkeyMapLive() {
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const load = () => {
      const list = projectMapService.getAll();
      setProjects([...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    };
    load();
    return subscribeMapProjects(load);
  }, []);

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const categories = ["all", "klima", "vrf", "kazan", "isi-pompasi", "yangin", "diger"];
  const categoryLabels: Record<string, string> = {
    all: "Tümü",
    klima: "Klima",
    vrf: "VRF",
    kazan: "Kazan",
    "isi-pompasi": "Isı Pompası",
    yangin: "Yangın",
    diger: "Diğer",
  };

  return (
    <section className="map-section" id="projeler">
      <div className="map-header">
        <h2 className="map-title">
          Türkiye Genelinde
          <br />
          <span style={{ color: "var(--gold)" }}>{projects.length}+ Proje</span>
        </h2>

        <div className="map-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`map-chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
              type="button"
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="map-container-wrapper">
        <MapContainer
          center={[39.0, 35.0]}
          zoom={6}
          scrollWheelZoom={false}
          className="leaflet-map"
          style={{ height: "500px", width: "100%", borderRadius: "16px" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {filtered.map((project) => (
            <CircleMarker
              key={project.id}
              center={[project.lat, project.lng]}
              radius={10}
              pathOptions={{
                color: CATEGORY_COLORS[project.category] ?? "#fff",
                fillColor: CATEGORY_COLORS[project.category] ?? "#fff",
                fillOpacity: 0.85,
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
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default TurkeyMapLive;
