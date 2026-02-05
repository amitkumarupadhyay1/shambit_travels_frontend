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

// Advanced fragment shader with organic mesh gradient effect
const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  varying vec2 vUv;
  
  // Sacred color palette - more vibrant for better blending
  vec3 saffron = vec3(0.851, 0.463, 0.024);  // #D97706
  vec3 gold = vec3(0.788, 0.635, 0.153);     // #C9A227
  vec3 ivory = vec3(0.980, 0.969, 0.941);    // #FAF7F0
  vec3 sand = vec3(0.961, 0.937, 0.902);     // #F5EFE6
  vec3 lightGold = vec3(0.95, 0.85, 0.65);   // Lighter gold for highlights
  
  // Improved noise function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // Fractal Brownian Motion for organic patterns
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 6; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  // Smooth minimum function for organic blending
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }
  
  // Distance function for organic blobs
  float blob(vec2 p, vec2 center, float radius) {
    return length(p - center) - radius;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 mouse = u_mouse / u_resolution;
    
    // Normalize mouse to -1 to 1 range
    mouse = (mouse - 0.5) * 2.0;
    
    float time = u_time * 0.3;
    
    // Create multiple organic blob centers that move and respond to mouse
    vec2 blob1Center = vec2(
      0.3 + sin(time * 0.8) * 0.2 + mouse.x * 0.1,
      0.7 + cos(time * 0.6) * 0.15 + mouse.y * 0.08
    );
    
    vec2 blob2Center = vec2(
      0.8 + sin(time * 1.2 + 2.0) * 0.18 + mouse.x * 0.12,
      0.2 + cos(time * 0.9 + 1.5) * 0.2 + mouse.y * 0.1
    );
    
    vec2 blob3Center = vec2(
      0.2 + sin(time * 0.7 + 4.0) * 0.25 + mouse.x * 0.08,
      0.3 + cos(time * 1.1 + 3.0) * 0.18 + mouse.y * 0.12
    );
    
    vec2 blob4Center = vec2(
      0.6 + sin(time * 0.9 + 1.0) * 0.15 + mouse.x * 0.15,
      0.8 + cos(time * 0.8 + 2.5) * 0.22 + mouse.y * 0.09
    );
    
    vec2 blob5Center = vec2(
      0.5 + sin(time * 1.0 + 3.5) * 0.12 + mouse.x * 0.2,
      0.5 + cos(time * 0.75 + 1.8) * 0.16 + mouse.y * 0.18
    );
    
    // Add noise-based distortion to blob centers
    float noiseScale = 0.8;
    blob1Center += vec2(fbm(uv * noiseScale + time), fbm(uv * noiseScale + time + 10.0)) * 0.05;
    blob2Center += vec2(fbm(uv * noiseScale + time + 20.0), fbm(uv * noiseScale + time + 30.0)) * 0.06;
    blob3Center += vec2(fbm(uv * noiseScale + time + 40.0), fbm(uv * noiseScale + time + 50.0)) * 0.04;
    blob4Center += vec2(fbm(uv * noiseScale + time + 60.0), fbm(uv * noiseScale + time + 70.0)) * 0.07;
    blob5Center += vec2(fbm(uv * noiseScale + time + 80.0), fbm(uv * noiseScale + time + 90.0)) * 0.05;
    
    // Calculate distances to blobs with varying radii
    float d1 = blob(uv, blob1Center, 0.25 + sin(time * 1.3) * 0.05);
    float d2 = blob(uv, blob2Center, 0.3 + cos(time * 1.1) * 0.06);
    float d3 = blob(uv, blob3Center, 0.2 + sin(time * 0.9) * 0.04);
    float d4 = blob(uv, blob4Center, 0.35 + cos(time * 1.4) * 0.07);
    float d5 = blob(uv, blob5Center, 0.28 + sin(time * 0.7) * 0.05);
    
    // Smooth minimum blending for organic shapes
    float k = 0.15; // Blending factor
    float d = smin(d1, d2, k);
    d = smin(d, d3, k);
    d = smin(d, d4, k);
    d = smin(d, d5, k);
    
    // Convert distance to smooth gradient
    float gradient = 1.0 - smoothstep(-0.1, 0.4, d);
    
    // Add fine noise for texture
    float fineNoise = fbm(uv * 8.0 + time * 0.5) * 0.1;
    gradient += fineNoise;
    
    // Create color zones based on blob influences
    float influence1 = 1.0 - smoothstep(0.0, 0.6, length(uv - blob1Center));
    float influence2 = 1.0 - smoothstep(0.0, 0.7, length(uv - blob2Center));
    float influence3 = 1.0 - smoothstep(0.0, 0.5, length(uv - blob3Center));
    float influence4 = 1.0 - smoothstep(0.0, 0.8, length(uv - blob4Center));
    float influence5 = 1.0 - smoothstep(0.0, 0.6, length(uv - blob5Center));
    
    // Enhanced mouse influence
    float mouseInfluence = 1.0 - smoothstep(0.0, 0.8, length(uv - (mouse * 0.5 + 0.5)));
    mouseInfluence *= sin(time * 2.0) * 0.5 + 0.5;
    
    // Mix colors based on influences
    vec3 color = ivory; // Base color
    
    // Layer colors with smooth blending
    color = mix(color, saffron, influence1 * gradient * 0.6);
    color = mix(color, gold, influence2 * gradient * 0.5);
    color = mix(color, sand, influence3 * gradient * 0.7);
    color = mix(color, lightGold, influence4 * gradient * 0.4);
    color = mix(color, saffron * 0.8, influence5 * gradient * 0.5);
    
    // Add mouse-driven color highlights
    color = mix(color, gold * 1.2, mouseInfluence * 0.3);
    
    // Add subtle color variations based on position
    float positionVariation = sin(uv.x * 3.14159) * cos(uv.y * 3.14159) * 0.1;
    color += positionVariation * vec3(0.05, 0.03, 0.02);
    
    // Ensure colors stay within a pleasant range
    color = clamp(color, vec3(0.85, 0.82, 0.78), vec3(1.0, 0.98, 0.95));
    
    // Add subtle vignette effect
    float vignette = 1.0 - length(uv - 0.5) * 0.8;
    color *= vignette;
    
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
        // Normalize to 0-1 range for better shader compatibility
        const x = (event.clientX - rect.left) / rect.width;
        const y = 1.0 - (event.clientY - rect.top) / rect.height; // Flip Y for WebGL
        
        setMousePosition({
          x: x * rect.width,
          y: y * rect.height,
        });
      }
    };

    // Use global mouse tracking for better responsiveness
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = 1.0 - (event.clientY - rect.top) / rect.height;
        
        // Only update if mouse is within reasonable bounds
        if (x >= -0.2 && x <= 1.2 && y >= -0.2 && y <= 1.2) {
          setMousePosition({
            x: x * rect.width,
            y: y * rect.height,
          });
        }
      }
    };

    // Add both local and global listeners for smooth tracking
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
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
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <GradientMesh mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}