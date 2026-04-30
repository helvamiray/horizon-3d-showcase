import { useEffect, useRef } from "react";
import * as THREE from "three";

type Kind = "ac" | "heatpump" | "fire-extinguisher";

interface Props {
  kind: Kind;
  spinning?: boolean;
}

/** Tiny in-card 3D scene. Self-contained Three.js mount, no controls. */
const Mini3DPreview = ({ kind, spinning = true }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = ref.current;
    if (!mount) return;

    const w = mount.clientWidth || 320;
    const h = mount.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(2.4, 1.6, 3.2);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xb0d8ff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 5, 4);
    scene.add(key);
    const cyan = new THREE.PointLight(0x00f0ff, 0.7, 12);
    cyan.position.set(-2, 1.2, 2);
    scene.add(cyan);
    const amber = new THREE.PointLight(0xff9d00, 0.5, 12);
    amber.position.set(2, -0.5, -2);
    scene.add(amber);

    const metal = (c = 0xe8eef2) =>
      new THREE.MeshStandardMaterial({ color: c, metalness: 0.85, roughness: 0.25 });
    const plastic = (c = 0xf4f6f8) =>
      new THREE.MeshStandardMaterial({ color: c, metalness: 0.05, roughness: 0.5 });

    const root = new THREE.Group();

    if (kind === "ac") {
      // Indoor split AC, larger & detailed
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.45), plastic());
      root.add(body);
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.12, 0.42), plastic(0xeef2f5));
      top.position.set(0, 0.32, 0.02);
      top.rotation.x = -0.25;
      root.add(top);
      const louver = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.16, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x1a2230, metalness: 0.5, roughness: 0.4 })
      );
      louver.position.set(0, -0.18, 0.215);
      root.add(louver);
      // Vent slats
      for (let i = 0; i < 18; i++) {
        const s = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.01, 0.03),
          plastic(0xd6dde3)
        );
        s.position.set(-0.85 + i * 0.1, 0.05, 0.225);
        root.add(s);
      }
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.025, 0.012),
        new THREE.MeshStandardMaterial({
          color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.6,
        })
      );
      led.position.set(0.7, -0.06, 0.23);
      root.add(led);
      const logo = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.05, 0.005),
        new THREE.MeshStandardMaterial({ color: 0x2a323d })
      );
      logo.position.set(-0.7, -0.06, 0.231);
      root.add(logo);
      root.position.y = 0.2;
    } else if (kind === "heatpump") {
      // Aerona-style outdoor unit: tall louvered cabinet + fan grill
      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 0.85), metal(0xdcdfe3));
      root.add(cab);
      // Front fan grill
      const grill = new THREE.Mesh(
        new THREE.RingGeometry(0.32, 0.62, 40),
        new THREE.MeshStandardMaterial({
          color: 0x1f242c, metalness: 0.6, roughness: 0.5, side: THREE.DoubleSide,
        })
      );
      grill.position.set(0, 0.05, 0.426);
      root.add(grill);
      // Concentric rings
      for (let r = 0.14; r < 0.6; r += 0.08) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.006, 6, 40),
          metal(0x2a3038)
        );
        ring.position.set(0, 0.05, 0.428);
        root.add(ring);
      }
      // Fan blades
      for (let i = 0; i < 5; i++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(1.05, 0.09, 0.012),
          plastic(0x4a525c)
        );
        blade.position.set(0, 0.05, 0.427);
        blade.rotation.z = (i * Math.PI * 2) / 5;
        root.add(blade);
      }
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.06, 18),
        metal(0x2c3038)
      );
      hub.rotation.x = Math.PI / 2;
      hub.position.set(0, 0.05, 0.45);
      root.add(hub);
      // Side louvers
      for (let i = 0; i < 12; i++) {
        const s = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.04, 0.78),
          plastic(0xb6bcc2)
        );
        s.position.set(-0.92, -0.55 + i * 0.1, 0);
        root.add(s);
      }
      // Brand stripe
      const badge = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.09, 0.012),
        new THREE.MeshStandardMaterial({
          color: 0x00b8d4, emissive: 0x00b8d4, emissiveIntensity: 0.7,
        })
      );
      badge.position.set(0.55, -0.65, 0.426);
      root.add(badge);
      // Feet
      [[-0.85, -0.82, 0.32], [0.85, -0.82, 0.32], [-0.85, -0.82, -0.32], [0.85, -0.82, -0.32]].forEach((p) => {
        const f = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.14), metal(0x3a3f48));
        f.position.set(p[0], p[1], p[2]);
        root.add(f);
      });
      camera.position.set(2.6, 1.3, 3.0);
    } else {
      // Fire extinguisher (red bottle + brass valve)
      const red = new THREE.MeshStandardMaterial({ color: 0xc0392b, metalness: 0.55, roughness: 0.35 });
      const brass = new THREE.MeshStandardMaterial({ color: 0xd4a04a, metalness: 0.85, roughness: 0.25 });
      const black = new THREE.MeshStandardMaterial({ color: 0x161a20, metalness: 0.4, roughness: 0.6 });

      // Body
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.5, 36), red);
      body.position.y = 0;
      root.add(body);
      // Top dome
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), red);
      dome.position.y = 0.75;
      root.add(dome);
      // Bottom dome
      const bot = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), red);
      bot.rotation.x = Math.PI;
      bot.position.y = -0.75;
      root.add(bot);
      // Base ring
      const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 32), black);
      baseRing.position.y = -0.95;
      root.add(baseRing);
      // Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 0.16, 24), brass);
      neck.position.y = 1.05;
      root.add(neck);
      // Valve body
      const valve = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.32), brass);
      valve.position.y = 1.25;
      root.add(valve);
      // Handle (squeeze lever)
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.08), black);
      handle.position.set(0, 1.42, 0);
      root.add(handle);
      // Pin ring
      const pin = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 16), brass);
      pin.position.set(0.27, 1.36, 0.08);
      pin.rotation.y = Math.PI / 2;
      root.add(pin);
      // Manometer
      const gauge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.05, 24),
        new THREE.MeshStandardMaterial({ color: 0xf5f5f0, metalness: 0.2, roughness: 0.4 })
      );
      gauge.rotation.x = Math.PI / 2;
      gauge.position.set(0, 1.28, 0.2);
      root.add(gauge);
      const needle = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.01, 0.005),
        new THREE.MeshStandardMaterial({ color: 0x00b34a, emissive: 0x00b34a, emissiveIntensity: 0.6 })
      );
      needle.position.set(0.02, 1.28, 0.226);
      needle.rotation.z = -0.4;
      root.add(needle);
      // Hose
      const hosePoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        hosePoints.push(
          new THREE.Vector3(
            0.25 + 0.25 * Math.sin(t * Math.PI),
            1.22 - t * 1.4,
            -0.05 + 0.1 * Math.sin(t * Math.PI * 1.5)
          )
        );
      }
      const hoseCurve = new THREE.CatmullRomCurve3(hosePoints);
      const hose = new THREE.Mesh(
        new THREE.TubeGeometry(hoseCurve, 36, 0.035, 12, false),
        black
      );
      root.add(hose);
      // Nozzle
      const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 16), black);
      nozzle.position.set(0.45, -0.2, 0.05);
      nozzle.rotation.z = Math.PI / 2;
      root.add(nozzle);
      // Label band
      const label = new THREE.Mesh(
        new THREE.CylinderGeometry(0.422, 0.422, 0.55, 36, 1, true),
        new THREE.MeshStandardMaterial({ color: 0xf5f5f0, metalness: 0.1, roughness: 0.7, side: THREE.DoubleSide })
      );
      label.position.y = 0.05;
      root.add(label);
      const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.423, 0.423, 0.06, 36, 1, true),
        new THREE.MeshStandardMaterial({ color: 0xc0392b, side: THREE.DoubleSide })
      );
      stripe.position.y = 0.32;
      root.add(stripe);
      camera.position.set(1.8, 1.3, 3.0);
    }

    scene.add(root);

    let raf = 0;
    const start = performance.now();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (spinning) {
        const t = (performance.now() - start) * 0.0006;
        root.rotation.y = t;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const ww = mount.clientWidth;
      const hh = mount.clientHeight;
      renderer.setSize(ww, hh);
      camera.aspect = ww / hh;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [kind, spinning]);

  return <div ref={ref} className="absolute inset-0" />;
};

export default Mini3DPreview;
