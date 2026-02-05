import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import HeroBackground from './HeroBackground';
import HeroParticles from './HeroParticles';
import HeroTyping from './HeroTyping';
import { cn } from '@/lib/utils';

interface HeroProps {
    children: ReactNode;
    className?: string;
}

export default function Hero({ children, className }: HeroProps) {
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    return (
        <section className={cn(
            "relative w-full min-h-screen flex items-center overflow-hidden bg-white m-0 p-0",
            className
        )}>
            <HeroBackground />
            <HeroParticles />

            <div className="relative z-20 w-full flex flex-col items-center justify-center py-20">
                <HeroTyping onComplete={() => setIsTypingComplete(true)} />

                {/* Content Container - Reveals after typing */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isTypingComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col items-center"
                >
                    {children}
                </motion.div>
            </div>
        </section>
    );
}
