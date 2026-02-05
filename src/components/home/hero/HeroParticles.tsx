'use client';

import { useMemo, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, MotionValue } from 'framer-motion';

// Particle Configuration
const PARTICLE_COUNT = 50;
const DAMPING = 20; // Reduced for faster reaction
const STIFFNESS = 100; // Softer spring

interface Particle {
    id: number;
    x: string;
    y: string;
    size: number;
    gradient: string;
    delay: number;
    duration: number;
}

const GRADIENTS = [
    'linear-gradient(135deg, #FF9933 0%, #FF5500 100%)',   // Saffron -> Dark Orange
    'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',   // Pink -> Purple
    'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',   // Blue -> Cyan
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',   // Amber -> Gold
    'linear-gradient(135deg, #10B981 0%, #059669 100%)',   // Emerald
];

export default function HeroParticles() {
    // Mouse position tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Scroll tracking for Parallax
    const { scrollY } = useScroll();

    // Smooth spring physics for cursor following
    const smoothX = useSpring(mouseX, { damping: DAMPING, stiffness: STIFFNESS });
    const smoothY = useSpring(mouseY, { damping: DAMPING, stiffness: STIFFNESS });

    // Generate particles only on client to avoid hydration mismatch
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const generatedParticles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
            id: i,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            size: Math.random() * 8 + 4,
            gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
            delay: Math.random() * 2,
            duration: Math.random() * 10 + 10,
        }));
        
        // Use setTimeout to avoid setState during render
        setTimeout(() => {
            setParticles(generatedParticles);
        }, 0);
    }, []);

    // Update mouse position on move
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 2;
            const y = (clientY / innerHeight - 0.5) * 2;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="absolute inset-0 z-10 overflow-hidden">
            {particles.map((p) => (
                <MagneticParticle
                    key={p.id}
                    particle={p}
                    mouseX={smoothX}
                    mouseY={smoothY}
                    scrollY={scrollY}
                />
            ))}
        </div>
    );
}

interface ParticleProps {
    particle: Particle;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    scrollY: MotionValue<number>;
}

// Individual Particle Component
function MagneticParticle({ particle, mouseX, mouseY, scrollY }: ParticleProps) {
    // Create transforms based on distance "feeling" - use particle id for consistent randomness
    const mouseDepth = useMemo(() => (particle.id * 7 + 13) % 30 + 10, [particle.id]);

    // Parallax Factor: Some move faster (foreground), some slower (background)
    const parallaxFactor = useMemo(() => ((particle.id * 3 + 7) % 50) / 100 + 0.1, [particle.id]);

    const transformX = useTransform(mouseX, (x: number) => x * mouseDepth);
    const transformY = useTransform(mouseY, (y: number) => y * mouseDepth);

    // Vertical Parallax: Move particles up/down based on scroll
    const parallaxY = useTransform(scrollY, [0, 1000], [0, 500 * parallaxFactor]);

    // Combine transforms (Mouse + Scroll)
    const combinedY = useTransform(
        [transformY, parallaxY], 
        (values: number[]) => values[0] + values[1] * -1
    ); // Move UP when scrolling down

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: particle.delay + 0.5, duration: 1 }}
            style={{
                position: 'absolute',
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                background: particle.gradient,
                borderRadius: '50%',
                x: transformX,
                y: combinedY, // Using combined Y
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            className="will-change-transform"
        >
            {/* Internal floating animation loop */}
            <motion.div
                animate={{
                    y: [-10, 10, -10],
                    x: [-5, 5, -5],
                }}
                transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="w-full h-full rounded-full"
            />
        </motion.div>
    );
}
