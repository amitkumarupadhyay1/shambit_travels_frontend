'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader for the gradient effect
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader with interactive gradient diffusion
const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  varying vec2 vUv;
  
  // Sacred color palette
  vec3 saffron = vec3(0.851, 0.463, 0.024);  // #D97706
  vec3 gold = vec3(0.788, 0.635, 0.153);     // #C9A227
  vec3 ivory = vec3(0.980, 0.969, 0.941);    // #FAF7F0
  vec3 sand = vec3(0.961, 0.937, 0.902);     // #F5EFE6
  
  // Noise function for organic movement
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Smooth noise
  float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // Fractal noise
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * smoothNoise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 st = vUv;
    
    // Normalize mouse coordinates to 0-1 range
    vec2 mouse = u_mouse / u_resolution;
    
    // Create flowing movement based on time and mouse position
    float time = u_time * 0.5;
    
    // Enhanced mouse influence - make it more responsive
    vec2 mouseInfluence = (mouse - 0.5) * 2.0; // Center mouse and scale
    
    // Create dynamic flow based on mouse position
    vec2 flow = vec2(
      sin(time + st.x * 3.0 + mouseInfluence.x) * 0.2,
      cos(time + st.y * 3.0 + mouseInfluence.y) * 0.2
    );
    
    // Add mouse-driven distortion
    flow += mouseInfluence * 0.3 * sin(time * 1.5);
    
    // Create multiple gradient layers that respond to mouse
    vec2 pos1 = st + flow + mouseInfluence * 0.1;
    vec2 pos2 = st + flow * 1.5 + vec2(0.3, 0.1) + mouseInfluence * 0.15;
    vec2 pos3 = st + flow * 0.7 + vec2(-0.2, 0.4) + mouseInfluence * 0.08;
    
    // Generate noise patterns
    float noise1 = fbm(pos1 * 2.0 + time);
    float noise2 = fbm(pos2 * 1.5 + time * 1.2);
    float noise3 = fbm(pos3 * 2.5 + time * 0.8);
    
    // Create gradient zones that follow mouse more closely
    float dist1 = distance(st, vec2(0.2 + mouse.x * 0.6, 0.8 + mouse.y * 0.4));
    float dist2 = distance(st, vec2(0.8 + mouse.x * 0.4, 0.2 + mouse.y * 0.6));
    float dist3 = distance(st, vec2(0.5 + mouse.x * 0.2, 0.5 + mouse.y * 0.2));
    
    // Create smooth gradient blobs that respond to mouse
    float blob1 = 1.0 - smoothstep(0.0, 0.7 + mouse.x * 0.3, dist1);
    float blob2 = 1.0 - smoothstep(0.0, 0.9 + mouse.y * 0.3, dist2);
    float blob3 = 1.0 - smoothstep(0.0, 0.5 + (mouse.x + mouse.y) * 0.2, dist3);
    
    // Combine noise with blobs
    blob1 *= (0.6 + noise1 * 0.4);
    blob2 *= (0.6 + noise2 * 0.4);
    blob3 *= (0.6 + noise3 * 0.4);
    
    // Mix colors based on blobs and noise
    vec3 color = ivory; // Base color
    
    // Add saffron influence with mouse interaction
    color = mix(color, saffron, blob1 * (0.3 + mouse.x * 0.2));
    
    // Add gold influence with mouse interaction
    color = mix(color, gold, blob2 * (0.25 + mouse.y * 0.2));
    
    // Add sand influence
    color = mix(color, sand, blob3 * (0.4 + (mouse.x + mouse.y) * 0.1));
    
    // Add subtle overall noise for texture
    float overallNoise = fbm(st * 4.0 + time * 0.5 + mouseInfluence * 0.1) * 0.08;
    color += overallNoise;
    
    // Ensure colors stay within sacred palette range
    color = clamp(color, vec3(0.88, 0.88, 0.82), vec3(1.0, 1.0, 1.0));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface GradientMeshProps {
  mousePosition: { x: number; y: number };
}

function GradientMesh({ mousePosition }: GradientMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size.width, size.height]
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.elapsedTime;
      // Update mouse position in real-time
      material.uniforms.u_mouse.value.set(mousePosition.x, mousePosition.y);
      material.uniforms.u_resolution.value.set(size.width, size.height);
    }
  });

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      }),
    [uniforms]
  );

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <planeGeometry args={[4, 4]} />
    </mesh>
  );
}

interface InteractiveGradientProps {
  className?: string;
}

export default function InteractiveGradient({ className = '' }: InteractiveGradientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Normalize mouse coordinates to screen space (0 to window dimensions)
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        setMousePosition({
          x: x,
          y: y,
        });
      }
    };

    // Add global mouse move listener for better tracking
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        setMousePosition({
          x: x,
          y: y,
        });
      }
    };

    // Listen to both container and global mouse movements
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mousemove', handleGlobalMouseMove);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          margin: 0,
          padding: 0
        }}
        gl={{ 
          antialias: true,
          alpha: false
        }}
      >
        <GradientMesh mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}