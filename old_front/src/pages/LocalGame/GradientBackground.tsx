import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const GradientBackground: React.FC = () => {
  const { scene } = useThree();
  
  useEffect(() => {
    // 그라디언트를 적용할 배경
    const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color("#ff7e5f") }, 
        color2: { value: new THREE.Color("#feb47b") }, 
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        void main() {
          gl_FragColor = vec4(mix(color1, color2, gl_FragCoord.y / 100.0), 1.0);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, -5); // 배경을 카메라 뒤에 배치
    scene.add(plane);

    return () => {
      scene.remove(plane); // cleanup
    };
  }, [scene]);

  return null;
};

export default GradientBackground;
