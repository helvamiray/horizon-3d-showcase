import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { useLanguage } from "@/i18n/LanguageContext";
import { BLUEPRINT_COLOR, SCENE_POSITIONS, snapToGrid, v3 } from "@/3d/sceneConstants";
import { sceneComponentService, type SceneComponent } from "@/lib/sceneComponentService";
import { getProducts } from "@/lib/productService";

interface Villa3DProps {
  highlightedKey: string | null;
}

interface InteractiveMeta {
  componentId: string;
  componentType: string;
  label: string;
  interactive: true;
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
  const focusTargetRef = useRef<THREE.Vector3 | null>(null);
  const focusRadiusRef = useRef<number | null>(null);
  const interactiveMeshesRef = useRef<THREE.Object3D[]>([]);
  const componentConfigRef = useRef<Map<string, SceneComponent>>(new Map());
  const defaultCameraRef = useRef({ position: SCENE_POSITIONS.CAMERA_DEFAULT_POSITION.clone(), lookAt: SCENE_POSITIONS.CAMERA_DEFAULT_LOOK_AT.clone() });
  const blueprintModeRef = useRef(false);
  const resetCameraRef = useRef<(() => void) | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [labelPositions, setLabelPositions] = useState<Record<string, { x: number; y: number }>>({});
  const { t } = useLanguage();

  // Update emissive whenever the highlighted key changes.
  useEffect(() => {
    highlightRef.current = highlightedKey;
    // Compute focus target (world pos) for camera tween
    if (highlightedKey) {
      const obj = componentsRef.current.get(highlightedKey);
      if (obj) {
        const box = new THREE.Box3().setFromObject(obj);
        const center = new THREE.Vector3();
        box.getCenter(center);
        focusTargetRef.current = center;
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        focusRadiusRef.current = Math.max(4, Math.min(10, maxDim * 4 + 3));
      }
    } else {
      focusTargetRef.current = null;
      focusRadiusRef.current = null;
    }
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

  const publicProducts = getProducts();
  const selectedSceneComponent = selectedComponentId ? componentConfigRef.current.get(selectedComponentId) ?? null : null;
  const linkedProduct = selectedSceneComponent?.linkedProductId
    ? publicProducts.find((product) => product.id === selectedSceneComponent.linkedProductId) ?? null
    : null;

  useEffect(() => {
    blueprintModeRef.current = blueprintMode;
    if (!blueprintMode) setLabelPositions({});
  }, [blueprintMode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.04);
    const sceneComponents = sceneComponentService.getAll();
    componentConfigRef.current = new Map(sceneComponents.map((component) => [component.id, component]));
    const getScenePlacement = (id: string, fallback: THREE.Vector3, fallbackRotationY = 0) => {
      const config = componentConfigRef.current.get(id);
      return {
        position: config ? v3(config.position.x, config.position.y, config.position.z) : fallback.clone(),
        rotation: config
          ? new THREE.Euler(config.rotation.x, config.rotation.y, config.rotation.z)
          : new THREE.Euler(0, fallbackRotationY, 0),
        visible: config?.visible ?? true,
      };
    };

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.copy(SCENE_POSITIONS.CAMERA_DEFAULT_POSITION);
    camera.lookAt(SCENE_POSITIONS.CAMERA_DEFAULT_LOOK_AT);

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
    const wallGeom = new THREE.BoxGeometry(
      SCENE_POSITIONS.WALL_WIDTH,
      SCENE_POSITIONS.WALL_HEIGHT,
      SCENE_POSITIONS.WALL_DEPTH
    );
    const walls = new THREE.LineSegments(new THREE.EdgesGeometry(wallGeom), wireMat);
    walls.position.y = SCENE_POSITIONS.FIRST_FLOOR_Y + SCENE_POSITIONS.WALL_HEIGHT / 2;
    villaGroup.add(walls);

    const floor2Geom = new THREE.BoxGeometry(
      SCENE_POSITIONS.WALL_WIDTH,
      SCENE_POSITIONS.WALL_HEIGHT - 0.5,
      SCENE_POSITIONS.WALL_DEPTH
    );
    const floor2 = new THREE.LineSegments(new THREE.EdgesGeometry(floor2Geom), wireMat);
    floor2.position.y = SCENE_POSITIONS.SECOND_FLOOR_Y + 1.2;
    villaGroup.add(floor2);

    const roofGeom = new THREE.ConeGeometry(4.3, 1.8, 4);
    const roof = new THREE.LineSegments(new THREE.EdgesGeometry(roofGeom), wireMat);
    roof.position.y = SCENE_POSITIONS.CEILING_Y + 0.5;
    roof.rotation.y = Math.PI / 4;
    villaGroup.add(roof);

    const ghostMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff, transparent: true, opacity: 0.04, side: THREE.DoubleSide,
    });
    villaGroup.add(
      new THREE.Mesh(wallGeom, ghostMat).translateY(
        SCENE_POSITIONS.FIRST_FLOOR_Y + SCENE_POSITIONS.WALL_HEIGHT / 2
      )
    );
    villaGroup.add(new THREE.Mesh(floor2Geom, ghostMat).translateY(SCENE_POSITIONS.SECOND_FLOOR_Y + 1.2));

    const zoneMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.45 });
    const livingGeom = new THREE.BoxGeometry(3.2, 2.8, 3.6);
    const living = new THREE.LineSegments(new THREE.EdgesGeometry(livingGeom), zoneMat);
    living.position.set(
      snapToGrid((SCENE_POSITIONS.SALON.x[0] + SCENE_POSITIONS.SALON.x[1]) / 2),
      SCENE_POSITIONS.FIRST_FLOOR_Y + 1.5,
      0
    );
    villaGroup.add(living);
    const mechGeom = new THREE.BoxGeometry(2.4, 2.8, 3.6);
    const mech = new THREE.LineSegments(new THREE.EdgesGeometry(mechGeom), zoneMat);
    mech.position.set(
      snapToGrid((SCENE_POSITIONS.MECHANICAL_ROOM.x[0] + SCENE_POSITIONS.MECHANICAL_ROOM.x[1]) / 2),
      SCENE_POSITIONS.FIRST_FLOOR_Y + 1.5,
      0
    );
    villaGroup.add(mech);
    const bedGeom = new THREE.BoxGeometry(2.8, 2.2, 3.6);
    villaGroup.add(
      new THREE.LineSegments(new THREE.EdgesGeometry(bedGeom), zoneMat)
        .translateX(-1.5)
        .translateY(SCENE_POSITIONS.SECOND_FLOOR_Y + 1.2)
    );
    villaGroup.add(
      new THREE.LineSegments(new THREE.EdgesGeometry(bedGeom), zoneMat)
        .translateX(1.5)
        .translateY(SCENE_POSITIONS.SECOND_FLOOR_Y + 1.2)
    );
    const slabGeom = new THREE.BoxGeometry(
      SCENE_POSITIONS.WALL_WIDTH,
      0.08,
      SCENE_POSITIONS.WALL_DEPTH
    );
    villaGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(slabGeom), zoneMat).translateY(SCENE_POSITIONS.SECOND_FLOOR_Y));

    // === Helper: register a component group as a "highlight target" ===
    const registerComponent = (
      key: string,
      group: THREE.Group | THREE.Mesh,
      componentType: string,
      label: string
    ) => {
      group.name = key;
      const meta: InteractiveMeta = {
        componentId: key,
        componentType,
        label,
        interactive: true,
      };
      group.userData = { ...group.userData, ...meta };
      interactiveMeshesRef.current.push(group);
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

    /** Wall-mounted ABC fire extinguisher (red bottle + brass valve). */
    const buildExtinguisher = () => {
      const g = new THREE.Group();
      const red = new THREE.MeshStandardMaterial({ color: 0xc0392b, metalness: 0.55, roughness: 0.35 });
      const brass = new THREE.MeshStandardMaterial({ color: 0xd4a04a, metalness: 0.85, roughness: 0.25 });
      const black = new THREE.MeshStandardMaterial({ color: 0x161a20, metalness: 0.4, roughness: 0.6 });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.45, 24), red);
      g.add(body);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), red);
      dome.position.y = 0.225;
      g.add(dome);
      const bot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), red);
      bot.rotation.x = Math.PI;
      bot.position.y = -0.225;
      g.add(bot);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.05, 16), brass);
      neck.position.y = 0.32;
      g.add(neck);
      const valve = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.1), brass);
      valve.position.y = 0.38;
      g.add(valve);
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.014, 0.026), black);
      handle.position.set(0, 0.435, 0);
      g.add(handle);
      const gauge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.018, 16),
        new THREE.MeshStandardMaterial({ color: 0xf5f5f0, metalness: 0.2, roughness: 0.4 })
      );
      gauge.rotation.x = Math.PI / 2;
      gauge.position.set(0, 0.39, 0.06);
      g.add(gauge);
      const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.025, 24), black);
      baseRing.position.y = -0.29;
      g.add(baseRing);
      // Wall bracket
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04), metalMat(0xb0b8bf));
      bracket.position.set(0, 0, -0.13);
      g.add(bracket);
      return g;
    };

    /** Viessmann-style condensing boiler cabinet + flue + condensate pipe. */
    const buildBoiler = () => {
      const g = new THREE.Group();
      const cabMat = new THREE.MeshStandardMaterial({ color: 0xf5f7f9, metalness: 0.25, roughness: 0.4 });
      const accent = new THREE.MeshStandardMaterial({ color: 0xc83a3a, metalness: 0.4, roughness: 0.4 });
      const dark = new THREE.MeshStandardMaterial({ color: 0x222831, metalness: 0.5, roughness: 0.4 });

      // Main cabinet (tall wall-hung box)
      const cab = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.45), cabMat);
      g.add(cab);
      // Top accent stripe (Viessmann red)
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.46), accent);
      stripe.position.y = 0.45;
      g.add(stripe);
      // Display
      const display = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.12, 0.01),
        new THREE.MeshStandardMaterial({
          color: 0x0a1626, emissive: 0x00f0ff, emissiveIntensity: 0.8,
        })
      );
      display.position.set(0, 0.18, 0.226);
      g.add(display);
      // Logo plate
      const logo = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.05, 0.005),
        new THREE.MeshStandardMaterial({ color: 0xc83a3a })
      );
      logo.position.set(0, 0.34, 0.228);
      g.add(logo);
      // Bottom vents
      for (let i = 0; i < 8; i++) {
        const v = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.012, 0.005), dark);
        v.position.set(0, -0.32 + i * 0.025, 0.226);
        g.add(v);
      }
      // Flue pipe (concentric, going up through ceiling)
      const flue = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 1.4, 16),
        metalMat(0xc8ccd1)
      );
      flue.position.set(-0.2, 1.25, 0);
      g.add(flue);
      const flueOuter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.4, 16),
        metalMat(0xa8acb1)
      );
      flueOuter.position.set(-0.2, 0.65, 0);
      g.add(flueOuter);
      // Gas pipe (yellow)
      const gas = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.5, 12),
        new THREE.MeshStandardMaterial({ color: 0xe8c842, metalness: 0.6, roughness: 0.3 })
      );
      gas.position.set(0.18, -0.8, 0);
      g.add(gas);
      // Hydraulic flow/return pipes (red/blue)
      [
        { x: -0.12, color: 0xc0392b },
        { x: 0, color: 0x1f5fa8 },
        { x: 0.12, color: 0xd4a04a },
      ].forEach((p) => {
        const pipe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 0.45, 12),
          new THREE.MeshStandardMaterial({ color: p.color, metalness: 0.55, roughness: 0.35 })
        );
        pipe.position.set(p.x, -0.78, 0);
        g.add(pipe);
      });
      return g;
    };

    /** Industrial kitbash: copper/steel pipes, elbows, gauges along the wall. */
    const buildPipeKitbash = () => {
      const g = new THREE.Group();
      const copper = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.85, roughness: 0.3 });
      const steel = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, metalness: 0.85, roughness: 0.3 });
      const brass = new THREE.MeshStandardMaterial({ color: 0xd4a04a, metalness: 0.85, roughness: 0.25 });

      // Horizontal copper run
      const main = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.6, 16), copper);
      main.rotation.z = Math.PI / 2;
      main.position.set(0, 0.25, -0.05);
      g.add(main);
      // Lower steel run
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.6, 16), steel);
      lower.rotation.z = Math.PI / 2;
      lower.position.set(0, 0.05, 0.08);
      g.add(lower);
      // Elbows + drops
      [-0.6, -0.2, 0.2, 0.6].forEach((x) => {
        const elbow = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.035, 10, 16, Math.PI / 2), copper);
        elbow.position.set(x, 0.25, -0.05);
        elbow.rotation.x = Math.PI / 2;
        g.add(elbow);
        const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.35, 12), copper);
        drop.position.set(x, 0.08, -0.05);
        g.add(drop);
        // Brass valve
        const valve = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), brass);
        valve.position.set(x, -0.12, -0.05);
        g.add(valve);
        // Wheel handle
        const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 8, 18), brass);
        wheel.position.set(x, -0.12, 0.05);
        wheel.rotation.y = Math.PI / 2;
        g.add(wheel);
      });
      // Pressure gauge
      const gaugeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 20), steel);
      gaugeBody.rotation.x = Math.PI / 2;
      gaugeBody.position.set(0.4, 0.42, -0.05);
      g.add(gaugeBody);
      const dial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.005, 20),
        new THREE.MeshStandardMaterial({ color: 0xf7f3e6 })
      );
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0.4, 0.42, -0.025);
      g.add(dial);
      // Pipe brackets on wall
      [-0.7, -0.3, 0.3, 0.7].forEach((x) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.04), steel);
        b.position.set(x, 0.25, -0.1);
        g.add(b);
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
      // Wall-mounted extinguisher next to riser
      const ext = buildExtinguisher();
      ext.position.set(0.55, 0.3, -0.35);
      g.add(ext);
      return g;
    };

    // === Heat pump (outside, left of villa) ===
    const heatpumpGroup = buildHeatPump();
    const heatpumpPlacement = getScenePlacement("heatpump", SCENE_POSITIONS.HEATPUMP, Math.PI / 6);
    heatpumpGroup.position.copy(heatpumpPlacement.position);
    heatpumpGroup.rotation.copy(heatpumpPlacement.rotation);
    heatpumpGroup.visible = heatpumpPlacement.visible;
    registerComponent("heatpump", heatpumpGroup, "HEAT_PUMP", "Isı Pompası");

    // === AC indoor units (3 wall-mounted) ===
    const acGroup = new THREE.Group();
    const acConfigs: { pos: THREE.Vector3; rot: number }[] = [
      { pos: SCENE_POSITIONS.AC_UNIT_SALON, rot: 0 },
      { pos: SCENE_POSITIONS.AC_UNIT_BEDROOM_1, rot: 0 },
      { pos: SCENE_POSITIONS.AC_UNIT_BEDROOM_2, rot: Math.PI },
    ];
    acConfigs.forEach((c) => {
      const unit = buildACIndoor();
      unit.position.copy(c.pos);
      unit.rotation.y = c.rot;
      acGroup.add(unit);
    });
    const acPlacement = getScenePlacement("ac-units", SCENE_POSITIONS.AC_UNIT_SALON, 0);
    acGroup.position.copy(acPlacement.position.clone().sub(SCENE_POSITIONS.AC_UNIT_SALON));
    acGroup.rotation.copy(acPlacement.rotation);
    acGroup.visible = acPlacement.visible;
    registerComponent("ac-units", acGroup, "AC_UNIT", "Klima Üniteleri");

    // === Fire suppression system (mechanical room) ===
    const fireGroup = buildFireSystem();
    const firePlacement = getScenePlacement("fire-system", SCENE_POSITIONS.FIRE_SYSTEM, 0);
    fireGroup.position.copy(firePlacement.position);
    fireGroup.rotation.copy(firePlacement.rotation);
    fireGroup.visible = firePlacement.visible;
    registerComponent("fire-system", fireGroup, "OTHER", "Yangın Sistemi");

    // ============================================================
    //  Simple cyan emissive components (existing system items)
    // ============================================================
    const makeEmissive = (
      key: string,
      geom: THREE.BufferGeometry,
      fallbackPos: THREE.Vector3,
      componentType: string,
      label: string
    ) => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.25,
        metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.92,
      });
      const mesh = new THREE.Mesh(geom, mat);
      const placement = getScenePlacement(key, fallbackPos, 0);
      mesh.position.copy(placement.position);
      const g = new THREE.Group();
      g.add(mesh);
      g.visible = placement.visible;
      registerComponent(key, g, componentType, label);
    };

    // Detailed Viessmann-style boiler (mechanical room, wall-hung)
    const boilerGroup = buildBoiler();
    const boilerPlacement = getScenePlacement("boiler", SCENE_POSITIONS.BOILER, 0);
    boilerGroup.position.copy(boilerPlacement.position);
    boilerGroup.rotation.copy(boilerPlacement.rotation);
    boilerGroup.visible = boilerPlacement.visible;
    registerComponent("boiler", boilerGroup, "BOILER", "Kombi");

    // Industrial pipe kitbash next to boiler
    const kitbash = buildPipeKitbash();
    kitbash.position.copy(SCENE_POSITIONS.KITBASH);
    villaGroup.add(kitbash);

    makeEmissive(
      "tank",
      new THREE.CylinderGeometry(0.45, 0.45, 1.6, 24),
      SCENE_POSITIONS.TANK,
      "OTHER",
      "Tampon Tank"
    );
    makeEmissive(
      "pump",
      new THREE.SphereGeometry(0.28, 16, 16),
      SCENE_POSITIONS.PUMP,
      "OTHER",
      "Pompa"
    );
    makeEmissive(
      "manifold",
      new THREE.BoxGeometry(1.6, 0.18, 0.25),
      SCENE_POSITIONS.MANIFOLD,
      "OTHER",
      "Kollektör"
    );

    // Underfloor pipe grid
    const underGroup = new THREE.Group();
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.25,
      metalness: 0.4, roughness: 0.4,
    });
    for (
      let x = SCENE_POSITIONS.UNDERFLOOR_START_X;
      x <= SCENE_POSITIONS.UNDERFLOOR_END_X;
      x += SCENE_POSITIONS.UNDERFLOOR_STEP
    ) {
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 3.6, 8), pipeMat.clone()
      );
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(
        snapToGrid(x),
        SCENE_POSITIONS.UNDERFLOOR_Y + 0.05,
        0
      );
      underGroup.add(pipe);
    }
    const underPlacement = getScenePlacement("underfloor", v3(0, SCENE_POSITIONS.UNDERFLOOR_Y, 0), 0);
    underGroup.position.copy(underPlacement.position);
    underGroup.visible = underPlacement.visible;
    registerComponent("underfloor", underGroup, "FLOOR_HEATING", "Yerden Isıtma");

    // Radiators
    const radGroup = new THREE.Group();
    SCENE_POSITIONS.RADIATOR_POSITIONS.forEach((p) => {
      const r = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.7, 0.12),
        new THREE.MeshStandardMaterial({
          color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.25,
          metalness: 0.5, roughness: 0.3,
        })
      );
      r.position.copy(p);
      radGroup.add(r);
    });
    const radPlacement = getScenePlacement("radiators", SCENE_POSITIONS.RADIATOR_POSITIONS[0], 0);
    radGroup.position.copy(radPlacement.position.clone().sub(SCENE_POSITIONS.RADIATOR_POSITIONS[0]));
    radGroup.visible = radPlacement.visible;
    registerComponent("radiators", radGroup, "RADIATOR", "Radyatörler");

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
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const zoomTarget = new THREE.Vector3();
    const zoomOffset = new THREE.Vector3(0, 1, 2);
    let isZoomed = false;
    const zoomToComponent = (object: THREE.Object3D) => {
      const worldPos = new THREE.Vector3();
      object.getWorldPosition(worldPos);
      zoomTarget.copy(worldPos);
      const destination = worldPos.clone().add(zoomOffset);
      isZoomed = true;
      gsap.to(camera.position, {
        x: destination.x,
        y: destination.y,
        z: destination.z,
        duration: 0.8,
        ease: "power2.inOut",
      });
      gsap.to(currentLook, {
        x: worldPos.x,
        y: worldPos.y,
        z: worldPos.z,
        duration: 0.8,
        ease: "power2.inOut",
      });
    };
    const resetCamera = () => {
      isZoomed = false;
      setSelectedComponentId(null);
      gsap.to(camera.position, {
        x: defaultCameraRef.current.position.x,
        y: defaultCameraRef.current.position.y,
        z: defaultCameraRef.current.position.z,
        duration: 0.8,
        ease: "power2.inOut",
      });
      gsap.to(currentLook, {
        x: defaultCameraRef.current.lookAt.x,
        y: defaultCameraRef.current.lookAt.y,
        z: defaultCameraRef.current.lookAt.z,
        duration: 0.8,
        ease: "power2.inOut",
      });
    };
    resetCameraRef.current = resetCamera;
    const onDown = (e: PointerEvent) => {
      isDown = true; prevX = e.clientX; prevY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshesRef.current, true);
      const hit = hits.find((item) => {
        let node: THREE.Object3D | null = item.object;
        while (node) {
          const data = node.userData as Partial<InteractiveMeta>;
          if (data.interactive === true) return true;
          node = node.parent;
        }
        return false;
      });
      if (hit) {
        let node: THREE.Object3D | null = hit.object;
        let componentId: string | undefined;
        while (node && !componentId) {
          componentId = (node.userData as Partial<InteractiveMeta>).componentId;
          node = node.parent;
        }
        if (componentId) {
          setSelectedComponentId(componentId);
          const target = componentsRef.current.get(componentId);
          if (target) zoomToComponent(target);
        }
      }
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
      if (isZoomed) return;
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
    const originalMaterialState = new WeakMap<
      THREE.Material,
      { color?: THREE.Color; emissive?: THREE.Color; wireframe?: boolean }
    >();
    let lastBlueprintState = blueprintModeRef.current;
    const applyBlueprintState = (enabled: boolean) => {
      scene.traverse((node) => {
        const mesh = node as THREE.Mesh;
        if (!mesh.isMesh) return;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => {
          const materialLike = material as THREE.Material & {
            color?: THREE.Color;
            emissive?: THREE.Color;
            wireframe?: boolean;
          };
          if (!originalMaterialState.has(material)) {
            originalMaterialState.set(material, {
              color: materialLike.color ? materialLike.color.clone() : undefined,
              emissive: materialLike.emissive ? materialLike.emissive.clone() : undefined,
              wireframe: typeof materialLike.wireframe === "boolean" ? materialLike.wireframe : undefined,
            });
          }
          const original = originalMaterialState.get(material);
          if (!original) return;
          if (enabled) {
            if (typeof materialLike.wireframe === "boolean") materialLike.wireframe = true;
            if (materialLike.color) materialLike.color = new THREE.Color(BLUEPRINT_COLOR);
            if (materialLike.emissive) materialLike.emissive = new THREE.Color(BLUEPRINT_COLOR);
          } else {
            if (typeof materialLike.wireframe === "boolean" && typeof original.wireframe === "boolean") {
              materialLike.wireframe = original.wireframe;
            }
            if (materialLike.color && original.color) materialLike.color = original.color.clone();
            if (materialLike.emissive && original.emissive) {
              materialLike.emissive = original.emissive.clone();
            }
          }
          material.needsUpdate = true;
        });
      });
    };
    applyBlueprintState(lastBlueprintState);
    const defaultLook = SCENE_POSITIONS.CAMERA_DEFAULT_LOOK_AT.clone();
    const currentLook = defaultLook.clone();
    let currentRadius = radius;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (lastBlueprintState !== blueprintModeRef.current) {
        lastBlueprintState = blueprintModeRef.current;
        applyBlueprintState(lastBlueprintState);
      }
      const effectiveYaw = yaw;

      // Lerp lookAt + radius toward focus target (or back to default)
      const targetLook = isZoomed ? zoomTarget : focusTargetRef.current ?? defaultLook;
      const targetRadius = focusRadiusRef.current ?? radius;
      currentLook.lerp(targetLook, 0.06);
      currentRadius += (targetRadius - currentRadius) * 0.06;

      const cx = Math.sin(effectiveYaw) * Math.cos(pitch) * currentRadius + currentLook.x;
      const cz = Math.cos(effectiveYaw) * Math.cos(pitch) * currentRadius + currentLook.z;
      const cy = Math.sin(pitch) * currentRadius + currentLook.y + 1.5;
      if (!isZoomed) {
        camera.position.set(cx, cy, cz);
      }
      camera.lookAt(currentLook);

      if (blueprintModeRef.current) {
        const nextLabels: Record<string, { x: number; y: number }> = {};
        const currentWidth = renderer.domElement.clientWidth;
        const currentHeight = renderer.domElement.clientHeight;
        componentsRef.current.forEach((obj, key) => {
          const p = new THREE.Vector3();
          obj.getWorldPosition(p);
          p.project(camera);
          const sx = ((p.x + 1) / 2) * currentWidth;
          const sy = ((-p.y + 1) / 2) * currentHeight;
          nextLabels[key] = { x: sx, y: sy };
        });
        setLabelPositions(nextLabels);
      }

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
      interactiveMeshesRef.current = [];
      resetCameraRef.current = null;
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
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setBlueprintMode((prev) => !prev)}
          className="rounded-md border border-cyan/40 bg-background/70 px-3 py-1 text-[10px] font-display tracking-[0.2em] uppercase text-cyan"
        >
          Kroki Modu
        </button>
        {selectedComponentId && (
          <button
            type="button"
            onClick={() => resetCameraRef.current?.()}
            className="rounded-md border border-amber/60 bg-background/80 px-3 py-1 text-[10px] font-display tracking-[0.2em] uppercase amber-text"
          >
            ← Geri
          </button>
        )}
      </div>
      {highlightedKey && (
        <div className="pointer-events-none absolute bottom-4 left-4 font-display text-xs tracking-[0.25em] uppercase amber-text animate-fade-in">
          {t("twin.highlight")}: {highlightedKey}
        </div>
      )}
      {blueprintMode &&
        Object.entries(labelPositions).map(([id, pos]) => (
          <div
            key={id}
            className="pointer-events-none absolute text-[10px] font-display tracking-[0.2em] uppercase text-cyan"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
          >
            {componentConfigRef.current.get(id)?.label ?? id}
          </div>
        ))}
      <aside
        className={`absolute top-0 right-0 h-full w-80 bg-background/95 border-l border-cyan/25 p-4 transition-transform duration-300 ${
          selectedSceneComponent ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedSceneComponent && (
          <div className="h-full flex flex-col">
            <button
              type="button"
              onClick={() => resetCameraRef.current?.()}
              className="self-end text-foreground/70 hover:text-cyan"
              aria-label="Kapat"
            >
              X
            </button>
            <h3 className="font-display text-xl text-cyan">{selectedSceneComponent.label}</h3>
            <span className="mt-2 inline-block rounded border border-cyan/40 px-2 py-1 text-[10px] tracking-[0.2em] uppercase text-cyan">
              {selectedSceneComponent.type}
            </span>
            <div className="mt-4 space-y-2 text-sm">
              <div>Marka: {linkedProduct?.brand ?? "-"}</div>
              <div className="text-foreground/70">{linkedProduct?.description ?? "Bağlı ürün yok."}</div>
              <ul className="space-y-1">
                {(linkedProduct?.specs ?? []).slice(0, 4).map((spec) => (
                  <li key={spec} className="text-xs text-foreground/80">
                    • {spec}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto space-y-2">
              <a
                href="#systems"
                className="block rounded-md border border-cyan/40 px-3 py-2 text-center text-xs uppercase tracking-[0.2em] text-cyan"
              >
                Ürün Sayfasına Git
              </a>
              <a
                href="#quote"
                className="block rounded-md bg-gradient-to-r from-cyan to-cyan-glow px-3 py-2 text-center text-xs uppercase tracking-[0.2em] text-background"
              >
                Teklif Al
              </a>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Villa3D;
