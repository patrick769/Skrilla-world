import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Animated "shattered armor" sphere:
 * glossy red core wrapped in floating dark triangular shards,
 * inspired by the Three.js banner concept.
 */
export const ShatterSphere: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    // Graceful fallback: if WebGL is unavailable, skip the 3D scene
    // instead of taking the whole page down.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
      console.warn('ShatterSphere: WebGL unavailable, skipping 3D scene.', err);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    // ---- Lights ----
    scene.add(new THREE.AmbientLight(0x201c14, 2.2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 6, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8899aa, 1.1);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    // Champagne glow from within
    const innerGlow = new THREE.PointLight(0xd9b264, 30, 20, 2);
    innerGlow.position.set(0, 0, 0);
    scene.add(innerGlow);

    const group = new THREE.Group();
    scene.add(group);

    // ---- Champagne core ----
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.45, 3),
      new THREE.MeshPhysicalMaterial({
        color: 0xa8863e,
        emissive: 0x2e2109,
        emissiveIntensity: 0.9,
        roughness: 0.25,
        metalness: 0.55,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
        flatShading: true
      })
    );
    group.add(core);

    // ---- Dark triangular shards ----
    const shardMatA = new THREE.MeshStandardMaterial({
      color: 0x1a1712,
      roughness: 0.32,
      metalness: 0.85,
      flatShading: true,
      side: THREE.DoubleSide
    });
    const shardMatB = new THREE.MeshStandardMaterial({
      color: 0x272219,
      roughness: 0.4,
      metalness: 0.75,
      flatShading: true,
      side: THREE.DoubleSide
    });

    interface ShardData {
      mesh: THREE.Mesh;
      normal: THREE.Vector3;
      centroid: THREE.Vector3;
      base: number;
      amp: number;
      phase: number;
      speed: number;
      tiltAxis: THREE.Vector3;
      tilt: number;
    }
    const shards: ShardData[] = [];

    const src = new THREE.IcosahedronGeometry(2.85, 2).toNonIndexed();
    const pos = src.getAttribute('position');
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();

    for (let i = 0; i < pos.count; i += 3) {
      vA.fromBufferAttribute(pos, i);
      vB.fromBufferAttribute(pos, i + 1);
      vC.fromBufferAttribute(pos, i + 2);

      const centroid = new THREE.Vector3().addVectors(vA, vB).add(vC).divideScalar(3);
      const normal = centroid.clone().normalize();

      // ~12% of faces are missing → red core shows through gaps
      if (Math.random() < 0.12) continue;

      const scale = 1.02 + Math.random() * 0.3;
      const g = new THREE.BufferGeometry();
      const verts = new Float32Array([
        (vA.x - centroid.x) * scale, (vA.y - centroid.y) * scale, (vA.z - centroid.z) * scale,
        (vB.x - centroid.x) * scale, (vB.y - centroid.y) * scale, (vB.z - centroid.z) * scale,
        (vC.x - centroid.x) * scale, (vC.y - centroid.y) * scale, (vC.z - centroid.z) * scale
      ]);
      g.setAttribute('position', new THREE.BufferAttribute(verts, 3));
      g.computeVertexNormals();

      const lifted = Math.random() < 0.22; // some shards float high like the concept art
      const mesh = new THREE.Mesh(g, Math.random() > 0.5 ? shardMatA : shardMatB);
      mesh.position.copy(centroid);
      group.add(mesh);

      shards.push({
        mesh,
        normal,
        centroid,
        base: lifted ? 0.35 + Math.random() * 0.75 : 0.04 + Math.random() * 0.12,
        amp: lifted ? 0.16 + Math.random() * 0.22 : 0.03 + Math.random() * 0.05,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.9,
        tiltAxis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        tilt: lifted ? (Math.random() - 0.5) * 0.9 : (Math.random() - 0.5) * 0.18
      });
    }
    src.dispose();

    // ---- Loose debris triangles drifting nearby ----
    const debris: { mesh: THREE.Mesh; orbit: number; radius: number; y: number; speed: number; spin: THREE.Vector3 }[] = [];
    for (let i = 0; i < 26; i++) {
      const s = 0.1 + Math.random() * 0.28;
      const g = new THREE.TetrahedronGeometry(s);
      const mesh = new THREE.Mesh(g, Math.random() > 0.4 ? shardMatA : shardMatB);
      const orbit = Math.random() * Math.PI * 2;
      const radius = 3.9 + Math.random() * 2.4;
      const y = (Math.random() - 0.5) * 5;
      mesh.position.set(Math.cos(orbit) * radius, y, Math.sin(orbit) * radius);
      scene.add(mesh);
      debris.push({
        mesh, orbit, radius, y,
        speed: 0.05 + Math.random() * 0.12,
        spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.02)
      });
    }

    // ---- Mouse parallax ----
    const target = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.x = nx * 0.35;
      target.y = ny * 0.25;
    };
    window.addEventListener('pointermove', onPointerMove);

    // ---- Loop ----
    let animId = 0;
    let t = 0;
    const tmp = new THREE.Vector3();
    const q = new THREE.Quaternion();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.008;

      group.rotation.y += 0.0028;
      group.rotation.x += (target.y * 0.6 - group.rotation.x) * 0.03;
      group.rotation.z += (-target.x * 0.25 - group.rotation.z) * 0.03;

      // shard breathing
      for (const s of shards) {
        const off = s.base + Math.sin(t * s.speed * 2 + s.phase) * s.amp;
        tmp.copy(s.normal).multiplyScalar(off).add(s.centroid);
        s.mesh.position.copy(tmp);
        q.setFromAxisAngle(s.tiltAxis, Math.sin(t * s.speed + s.phase) * s.tilt * 0.35);
        s.mesh.quaternion.copy(q);
      }

      // pulsing core glow
      innerGlow.intensity = 26 + Math.sin(t * 3) * 8;
      const cs = 1 + Math.sin(t * 3) * 0.012;
      core.scale.setScalar(cs);

      for (const d of debris) {
        d.orbit += d.speed * 0.01;
        d.mesh.position.set(Math.cos(d.orbit) * d.radius, d.y + Math.sin(t + d.radius) * 0.3, Math.sin(d.orbit) * d.radius);
        d.mesh.rotation.x += d.spin.x;
        d.mesh.rotation.y += d.spin.y;
        d.mesh.rotation.z += d.spin.z;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};
