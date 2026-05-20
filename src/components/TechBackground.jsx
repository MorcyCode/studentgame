import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TechBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050816, 0.035);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 160);
    camera.position.set(0, 4.6, 13);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const particleCount = window.innerWidth < 680 ? 520 : 920;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorA = new THREE.Color(0x52d8ff);
    const colorB = new THREE.Color(0x9a6bff);

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 42;
      positions[i3 + 1] = Math.random() * 22 - 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 52;

      const color = colorA.clone().lerp(colorB, Math.random());
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const grid = new THREE.GridHelper(64, 64, 0x35e7ff, 0x5846ff);
    grid.position.y = -3.5;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    scene.add(grid);

    const horizonGeometry = new THREE.PlaneGeometry(72, 30, 1, 1);
    const horizonMaterial = new THREE.MeshBasicMaterial({
      color: 0x111a46,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    horizon.rotation.x = -Math.PI / 2;
    horizon.position.set(0, -3.55, -14);
    scene.add(horizon);

    const beams = new THREE.Group();
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0x775dff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < 7; i += 1) {
      const geometry = new THREE.CylinderGeometry(0.012, 0.012, 32, 8);
      const beam = new THREE.Mesh(geometry, beamMaterial.clone());
      beam.position.set(-12 + i * 4, 2.4, -17 + (i % 2) * 4);
      beam.rotation.z = Math.PI / 5 + i * 0.09;
      beam.rotation.x = Math.PI / 2.2;
      beam.material.color.set(i % 2 ? 0x4fdfff : 0x8b62ff);
      beams.add(beam);
    }
    scene.add(beams);

    const pointer = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 4.6 };

    const handlePointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleResize);

    let animationId = 0;
    const clock = new THREE.Clock();

    const render = () => {
      const time = clock.getElapsedTime();
      stars.rotation.y = time * 0.012;
      stars.rotation.x = Math.sin(time * 0.18) * 0.018;
      grid.position.z = (time * 2.2) % 2;
      grid.material.opacity = 0.22 + Math.sin(time * 0.8) * 0.06;
      beams.rotation.y = Math.sin(time * 0.22) * 0.08;

      targetCamera.x = pointer.x * 0.7;
      targetCamera.y = 4.6 - pointer.y * 0.35;
      camera.position.x += (targetCamera.x - camera.position.x) * 0.045;
      camera.position.y += (targetCamera.y - camera.position.y) * 0.045;
      camera.lookAt(pointer.x * 0.45, -0.3, 0);

      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      starGeometry.dispose();
      starMaterial.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      horizonGeometry.dispose();
      horizonMaterial.dispose();
      beams.children.forEach((beam) => {
        beam.geometry.dispose();
        beam.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <div className="tech-background" ref={mountRef} />;
}
