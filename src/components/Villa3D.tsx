import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLanguage } from "@/i18n/LanguageContext";

interface Villa3DProps {
  highlightedKey: string | null;
}

/**
 * Optional GLB model URLs for the realistic units. Empty by default —
 * if a URL fails to load we silently fall back to the detailed procedural
 * mesh. Drop your own .glb into /public/models/ and reference here.
 */
const GLB_SOURCES: Record<string, string | null> = {
  heatpump: null,    // e.g. "/models/heatpump.glb"
  "ac-units": null,
  "fire-system": null,
};

/**
 * Procedural wireframe villa rendered with Three.js.
 * Realistic units (AC indoor heads, outdoor heat pump, sprinkler/fire
 * suppression) are composed from detailed multi-material groups so they read
 * as actual products rather than boxes. Each is mapped to a `componentKey`
 * — when its key matches `highlightedKey`, every emissive child glows in
 * neon amber and an aura halo pulses.
 */
const Villa3D = ({ highlightedKey }: Villa3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const highlightRef = useRef<string | null>(null);
  const { t } = useLanguage();

  // Update emissive whenever the highlighted key changes.
  useEffect(() => {
    highlightRef.current = highlightedKey;
    componentsRef.current.forEach((obj, key) => {
      const active = key === highlightedKey;
      obj.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          if (!mat) return;
          if ((mesh as unknown as { _isHalo?: boolean })._isHalo) return;
          const baseColor = (mesh as unknown as { _baseColor?: number })._baseColor;
          const baseEmissive = (mesh as unknown as { _baseEmissive?: number })._baseEmissive;
          if ("emissive" in mat) {
            if (active) {
              mat.emissive = new THREE.Color(0xff9d00);
              mat.emissiveIntensity = 1.4;
            } else {
              mat.emissive = new THREE.Color(baseEmissive ?? 0x00f0ff);
              mat.emissiveIntensity = baseEmissive != null ? 0.45 : 0.18;
            }
          }
          if (baseColor != null) {
            mat.color = new THREE.Color(active ? 0xff9d00 : baseColor);
          }
        });
      });
    });
  }, [highlightedKey]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(8, 6, 10);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // === Lighting ===
    scene.add(new THREE.AmbientLight(0x88ccff, 0.45));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(5, 10, 7);
    scene.add(dir);
    const cyanRim = new THREE.PointLight(0x00f0ff, 0.6, 30);
    cyanRim.position.set(6, 5, 6);
    scene.add(cyanRim);
    const amberRim = new THREE.PointLight(0xff9d00, 0.4, 30);
    amberRim.position.set(-6, 4, -4);
    scene.add(amberRim);

    // === Ground grid ===
    const grid = new THREE.GridHelper(30, 30, 0x00f0ff, 0x0a3a4a);
    (grid.material as THREE.Material).opacity = 0.35;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // === Villa shell (wireframe) ===
    const villaGroup = new THREE.Group();
    const wireMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });
    const wallGeom = new THREE.BoxGeometry(6, 3, 4);
    const walls = new THREE.LineSegments(new THREE.EdgesGeometry(wallGeom), wireMat);
    walls.position.y = 1.5;
    villaGroup.add(walls);

    const floor2Geom = new THREE.BoxGeometry(6, 2.4, 4);
    const floor2 = new THREE.LineSegments(new THREE.EdgesGeometry(floor2Geom), wireMat);
    floor2.position.y = 4.2;
    villaGroup.add(floor2);

    const roofGeom = new THREE.ConeGeometry(4.3, 1.8, 4);
    const roof = new THREE.LineSegments(new THREE.EdgesGeometry(roofGeom), wireMat);
    roof.position.y = 6.3;
    roof.rotation.y = Math.PI / 4;
    villaGroup.add(roof);

    const ghostMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff, transparent: true, opacity: 0.04, side: THREE.DoubleSide,
    });
    villaGroup.add(new THREE.Mesh(wallGeom, ghostMat).translateY(1.5));
    villaGroup.add(new THREE.Mesh(floor2Geom, ghostMat).translateY(4.2));

    const zoneMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.45 });
    const livingGeom = new THREE.BoxGeometry(3.2, 2.8, 3.6);
    const living = new THREE.LineSegments(new THREE.EdgesGeometry(livingGeom), zoneMat);
    living.position.set(-1.4, 1.5, 0);
    villaGroup.add(living);
    const mechGeom = new THREE.BoxGeometry(2.4, 2.8, 3.6);
    const mech = new THREE.LineSegments(new THREE.EdgesGeometry(mechGeom), zoneMat);
    mech.position.set(1.6, 1.5, 0);
    villaGroup.add(mech);
    const bedGeom = new THREE.BoxGeometry(2.8, 2.2, 3.6);
    villaGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(bedGeom), zoneMat).translateX(-1.5).translateY(4.2));
    villaGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(bedGeom), zoneMat).translateX(1.5).translateY(4.2));
    const slabGeom = new THREE.BoxGeometry(6, 0.08, 4);
    villaGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(slabGeom), zoneMat).translateY(3));

    // === Helper: register a component group as a "highlight target" ===
    const registerComponent = (key: string, group: THREE.Group | THREE.Mesh) => {
      group.name = key;
      // Tag halo planes so they don't get re-coloured
      group.traverse((c) => {
        const m = c as THREE.Mesh;
        if (!m.isMesh) return;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && "color" in mat && mat.color) {
          (m as unknown as { _baseColor: number })._baseColor = mat.color.getHex();
          if ("emissive" in mat && mat.emissive) {
            (m as unknown as { _baseEmissive: number })._baseEmissive = mat.emissive.getHex();
          }
        }
      });
      // Add halo
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 16, 12),
        new THREE.MeshBasicMaterial({
          color: 0xff9d00, transparent: true, opacity: 0, depthWrite: false,
        })
      );
      (halo as unknown as { _isHalo: boolean })._isHalo = true;
      halo.scale.set(1.2, 0.8, 0.8);
      group.add(halo);
      villaGroup.add(group);
      componentsRef.current.set(key, group);
    };

    // ============================================================
    //  REALISTIC PROCEDURAL UNITS (composed of many small meshes)
    // ============================================================

    const metalMat = (color = 0xe8eef2) =>
      new THREE.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.25 });
    const plasticMat = (color = 0xf0f4f7) =>
      new THREE.MeshStandardMaterial({ color, metalness: 0.05, roughness: 0.55 });
    const accentMat = () =>
      new THREE.MeshStandardMaterial({ color: 0x0a4a6a, metalness: 0.4, roughness: 0.4 });

    /** AC indoor split unit: white plastic body, dark louver, brand strip. */
    const buildACIndoor = () => {
      const g = new THREE.Group();
      // Body (rounded box look via stacked boxes)
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.26, 0.18), plasticMat());
      g.add(body);
      // Top angled chamfer
      const top = new THREE.Mesh(new THREE.BoxGeometry(0.93, 0.05, 0.17), plasticMat());
      top.position.set(0, 0.135, 0.005);
      top.rotation.x = -0.3;
      g.add(top);
      // Front louver (dark)
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.07, 0.02), accentMat());
      louver.position.set(0, -0.08, 0.085);
      g.add(louver);
      // LED strip
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.012, 0.005),
        new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.2 })
      );
      led.position.set(0.3, -0.04, 0.092);
      g.add(led);
      // Wall mount bracket
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.03, 0.04), metalMat(0xb0b8bf));
      bracket.position.set(0, 0.05, -0.1);
      g.add(bracket);
      return g;
    };

    /** Outdoor heat pump: louvered metal cabinet, fan grill, side vents. */
    const buildHeatPump = () => {
      const g = new THREE.Group();
      // Main cabinet
      const cabinet = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.85, 0.45),
        metalMat(0xdcdde0)
      );
      g.add(cabinet);
      // Front grill (concentric rings → fan)
      const fanGrill = new THREE.Mesh(
        new THREE.RingGeometry(0.18, 0.34, 32),
        new THREE.MeshStandardMaterial({ color: 0x222831, metalness: 0.7, roughness: 0.4, side: THREE.DoubleSide })
      );
      fanGrill.position.set(0, 0, 0.226);
      g.add(fanGrill);
      // Fan blades cross
      for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.05, 0.01),
          plasticMat(0x4d5560)
        );
        blade.position.set(0, 0, 0.225);
        blade.rotation.z = (i * Math.PI) / 3;
        g.add(blade);
      }
      // Fan hub
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16),
        metalMat(0x2c3038)
      );
      hub.rotation.x = Math.PI / 2;
      hub.position.set(0, 0, 0.236);
      g.add(hub);
      // Side louvers (slats)
      for (let i = -3; i <= 3; i++) {
        const slat = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.02, 0.42),
          plasticMat(0xb8bcc2)
        );
        slat.position.set(-0.5, i * 0.08, 0);
        g.add(slat);
      }
      // Brand badge
      const badge = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.05, 0.01),
        new THREE.MeshStandardMaterial({ color: 0x00b8d4, emissive: 0x00b8d4, emissiveIntensity: 0.5 })
      );
      badge.position.set(0.32, -0.36, 0.226);
      g.add(badge);
      // Base feet
      [[-0.45, -0.46, 0.18], [0.45, -0.46, 0.18], [-0.45, -0.46, -0.18], [0.45, -0.46, -0.18]].forEach((p) => {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.08), metalMat(0x3a3f48));
        foot.position.set(p[0], p[1], p[2]);
        g.add(foot);
      });
      return g;
    };

    /** Fire suppression assembly: red riser pipe, valve, sprinkler heads. */
    const buildFireSystem = () => {
      const g = new THREE.Group();
      const redMat = new THREE.MeshStandardMaterial({ color: 0xc0392b, metalness: 0.5, roughness: 0.4 });
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4a04a, metalness: 0.85, roughness: 0.25 });

      // Vertical riser
      const riser = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16), redMat);
      riser.position.set(0, 0.8, 0);
      g.add(riser);
      // Alarm valve assembly (box + handle)
      const valve = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.18), redMat);
      valve.position.set(0, 0.45, 0);
      g.add(valve);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 16), brassMat);
      handle.position.set(0, 0.45, 0.13);
      handle.rotation.y = Math.PI / 2;
      g.add(handle);
      // Horizontal feed
      const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.4, 12), redMat);
      feed.rotation.z = Math.PI / 2;
      feed.position.set(0, 1.55, 0);
      g.add(feed);
      // Sprinkler heads (3) — brass body + glass bulb
      [-0.55, 0, 0.55].forEach((x) => {
        const head = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 12), brassMat);
        head.add(body);
        const arms = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 6, 12), brassMat);
        arms.position.y = -0.05;
        arms.rotation.x = Math.PI / 2;
        head.add(arms);
        const bulb = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.04, 8),
          new THREE.MeshStandardMaterial({
            color: 0xff5050, emissive: 0xff5050, emissiveIntensity: 0.6,
            transparent: true, opacity: 0.85,
          })
        );
        bulb.position.y = -0.07;
        head.add(bulb);
        // Deflector disk
        const deflector = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.005, 16),
          brassMat
        );
        deflector.position.y = -0.092;
        head.add(deflector);
        head.position.set(x, 1.45, 0);
        g.add(head);
      });
      return g;
    };

    // === Heat pump (outside, left of villa) ===
    const heatpumpGroup = buildHeatPump();
    heatpumpGroup.position.set(-3.8, 0.5, 1.5);
    heatpumpGroup.rotation.y = Math.PI / 6;
    registerComponent("heatpump", heatpumpGroup);

    // === AC indoor units (3 wall-mounted) ===
    const acGroup = new THREE.Group();
    const acConfigs: { pos: [number, number, number]; rot: number }[] = [
      { pos: [-1.8, 4.7, 1.95], rot: 0 },
      { pos: [1.8, 4.7, 1.95], rot: 0 },
      { pos: [0, 4.7, -1.95], rot: Math.PI },
    ];
    acConfigs.forEach((c) => {
      const unit = buildACIndoor();
      unit.position.set(...c.pos);
      unit.rotation.y = c.rot;
      acGroup.add(unit);
    });
    registerComponent("ac-units", acGroup);

    // === Fire suppression system (mechanical room) ===
    const fireGroup = buildFireSystem();
    fireGroup.position.set(2.2, 0, 0.5);
    registerComponent("fire-system", fireGroup);

    // ============================================================
    //  Simple cyan emissive components (existing system items)
    // ============================================================
    const makeEmissive = (
      key: string, geom: THREE.BufferGeometry, pos: [number, number, number]
    ) => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.25,
        metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.92,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...pos);
      const g = new THREE.Group();
      g.add(mesh);
      registerComponent(key, g);
    };

    makeEmissive("boiler", new THREE.CylinderGeometry(0.35, 0.35, 1.2, 16), [2.2, 1.0, -1.2]);
    makeEmissive("tank", new THREE.CylinderGeometry(0.45, 0.45, 1.6, 24), [1.0, 1.2, -1.2]);
    makeEmissive("pump", new THREE.SphereGeometry(0.28, 16, 16), [1.6, 0.4, -0.2]);
    makeEmissive("manifold", new THREE.BoxGeometry(1.6, 0.18, 0.25), [0, 0.3, -1.5]);

    // Underfloor pipe grid
    const underGroup = new THREE.Group();
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.25,
      metalness: 0.4, roughness: 0.4,
    });
    for (let x = -2.5; x <= 2.5; x += 0.6) {
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 3.6, 8), pipeMat.clone()
      );
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(x, 0.05, 0);
      underGroup.add(pipe);
    }
    registerComponent("underfloor", underGroup);

    // Radiators
    const radGroup = new THREE.Group();
    const radPositions: [number, number, number][] = [
      [-2.4, 4.3, 1.85], [2.4, 4.3, 1.85], [0, 4.3, -1.85],
    ];
    radPositions.forEach((p) => {
      const r = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.7, 0.12),
        new THREE.MeshStandardMaterial({
          color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.25,
          metalness: 0.5, roughness: 0.3,
        })
      );
      r.position.set(...p);
      radGroup.add(r);
    });
    registerComponent("radiators", radGroup);

    scene.add(villaGroup);

    // === Optional GLB overrides ===
    const gltfLoader = new GLTFLoader();
    Object.entries(GLB_SOURCES).forEach(([key, url]) => {
      if (!url) return;
      gltfLoader.load(
        url,
        (gltf) => {
          const target = componentsRef.current.get(key);
          if (!target) return;
          // Replace contents: keep position but swap children
          target.clear();
          gltf.scene.scale.set(0.8, 0.8, 0.8);
          target.add(gltf.scene);
          // Re-tag base colours
          gltf.scene.traverse((c) => {
            const m = c as THREE.Mesh;
            if (!m.isMesh) return;
            const mat = m.material as THREE.MeshStandardMaterial;
            if (mat?.color) (m as unknown as { _baseColor: number })._baseColor = mat.color.getHex();
          });
        },
        undefined,
        () => {/* silent fallback */}
      );
    });

    // === Mouse controls ===
    let isDown = false;
    let prevX = 0, prevY = 0;
    let yaw = 0.4, pitch = 0.25;
    let radius = 14;
    const onDown = (e: PointerEvent) => {
      isDown = true; prevX = e.clientX; prevY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onUp = (e: PointerEvent) => {
      isDown = false;
      try { renderer.domElement.releasePointerCapture(e.pointerId); } catch {/*noop*/}
    };
    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX; prevY = e.clientY;
      yaw -= dx * 0.005;
      pitch = Math.max(-0.4, Math.min(1.2, pitch + dy * 0.005));
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      radius = Math.max(6, Math.min(28, radius + e.deltaY * 0.01));
    };
    const dom = renderer.domElement;
    dom.style.touchAction = "none";
    dom.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    dom.addEventListener("wheel", onWheel, { passive: false });

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    let raf = 0;
    let autoYaw = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      autoYaw += 0.0015;
      const effectiveYaw = isDown ? yaw : yaw + autoYaw;
      const x = Math.sin(effectiveYaw) * Math.cos(pitch) * radius;
      const z = Math.cos(effectiveYaw) * Math.cos(pitch) * radius;
      const y = Math.sin(pitch) * radius + 3;
      camera.position.set(x, y, z);
      camera.lookAt(0, 2.5, 0);

      // Pulse the highlighted component's halo
      componentsRef.current.forEach((obj, key) => {
        obj.traverse((c) => {
          const mesh = c as THREE.Mesh;
          if ((mesh as unknown as { _isHalo?: boolean })._isHalo) {
            const m = mesh.material as THREE.MeshBasicMaterial;
            if (key === highlightRef.current) {
              const t2 = performance.now() * 0.004;
              m.opacity = 0.18 + Math.sin(t2) * 0.12;
            } else {
              m.opacity = 0;
            }
          }
        });
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      dom.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      dom.removeEventListener("wheel", onWheel);
      renderer.dispose();
      if (dom.parentNode) dom.parentNode.removeChild(dom);
      componentsRef.current.clear();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] md:h-[600px] rounded-2xl overflow-hidden glass">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute top-4 left-4 font-display text-xs tracking-[0.3em] text-cyan/80 uppercase">
        {t("twin.live")}
      </div>
      <div className="pointer-events-none absolute top-4 right-4 flex flex-col gap-1 items-end font-display text-[9px] tracking-[0.25em] uppercase text-foreground/60">
        <span>{t("twin.zone.roof")}</span>
        <span>{t("twin.zone.bedrooms")}</span>
        <span>{t("twin.zone.living")}</span>
        <span>{t("twin.zone.mech")}</span>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 font-display text-[10px] tracking-[0.25em] text-foreground/50 uppercase">
        {t("twin.controls")}
      </div>
      {highlightedKey && (
        <div className="pointer-events-none absolute bottom-4 left-4 font-display text-xs tracking-[0.25em] uppercase amber-text animate-fade-in">
          {t("twin.highlight")}: {highlightedKey}
        </div>
      )}
    </div>
  );
};

export default Villa3D;
