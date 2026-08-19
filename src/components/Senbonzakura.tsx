"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function Senbonzakura() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    const container = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, -0.5);
    petalShape.quadraticCurveTo(0.5, -0.2, 0.5, 0.3);
    petalShape.quadraticCurveTo(0.5, 0.6, 0.2, 0.8);
    petalShape.quadraticCurveTo(0, 0.6, 0, 0.6);
    petalShape.quadraticCurveTo(-0.2, 0.8, -0.5, 0.8);
    petalShape.quadraticCurveTo(-0.5, 0.6, -0.5, 0.3);
    petalShape.quadraticCurveTo(-0.5, -0.2, 0, -0.5);

    const geometry = new THREE.ShapeGeometry(petalShape);
    const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 800 : 3500;
    const particles = new THREE.InstancedMesh(geometry, material, count);
    
    const dummy = new THREE.Object3D();
    const color1 = new THREE.Color(0xff4da6); // Vibrant Senbonzakura pink
    const color2 = new THREE.Color(0xffb7c5); // Soft light pink

    for (let i = 0; i < count; i++) {
        const r = 400 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        dummy.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );

        dummy.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        const scale = Math.random() * 1.5 + 0.5;
        dummy.scale.set(scale, scale, scale);

        dummy.updateMatrix();
        particles.setMatrixAt(i, dummy.matrix);

        const mixedColor = color1.clone().lerp(color2, Math.random());
        particles.setColorAt(i, mixedColor);
    }

    particles.instanceMatrix.needsUpdate = true;
    if (particles.instanceColor) particles.instanceColor.needsUpdate = true;
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    let targetWindX = 0;
    let targetWindY = 0;
    let windX = 0;
    let windY = 0;
    const clickSpin = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.5;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.5;
        targetWindX = (e.clientX / window.innerWidth - 0.5) * 1.5;
        targetWindY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    };
    
    const handleClick = () => {
        gsap.to(clickSpin, {
            x: (Math.random() - 0.5) * 5,
            y: (Math.random() - 0.5) * 5,
            duration: 0.2,
            onComplete: () => {
                gsap.to(clickSpin, { x: 0, y: 0, duration: 2, ease: "power2.out" });
            }
        });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();

        windX += (targetWindX - windX) * 0.05;
        windY += (targetWindY - windY) * 0.05;

        particles.rotation.y += (0.08 + windX + clickSpin.y) * delta;
        particles.rotation.x += (0.04 + windY + clickSpin.x) * delta;

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("click", handleClick);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
        container.removeChild(renderer.domElement);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" />;
}
