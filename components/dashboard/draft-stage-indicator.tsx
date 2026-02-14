'use client'

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, FileSearch, Sparkles, CheckCircle2 } from 'lucide-react';

interface Stage {
    id: number;
    icon: React.ElementType;
    label: string;
    duration: number; // milliseconds to stay on this stage
}

const stages: Stage[] = [
    { id: 1, icon: Brain, label: 'Understanding concept', duration: 700 },
    { id: 2, icon: FileSearch, label: 'Analyzing expectations', duration: 700 },
    { id: 3, icon: Sparkles, label: 'Generating response', duration: 1100 },
    { id: 4, icon: CheckCircle2, label: 'Draft ready', duration: 500 },
];

export function DraftStageIndicator() {
    const [currentStage, setCurrentStage] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Auto-advance through stages, but loop on the final stage
        const timer = setTimeout(() => {
            if (currentStage < stages.length - 1) {
                setCurrentStage(prev => prev + 1);
                setProgress(0);
            } else {
                // On final stage, reset progress to create continuous loop
                setProgress(0);
            }
        }, stages[currentStage].duration);

        return () => clearTimeout(timer);
    }, [currentStage, progress]);

    useEffect(() => {
        // Smooth progress bar animation
        if (currentStage < stages.length) {
            const duration = stages[currentStage].duration;
            const interval = 50; // Update every 50ms
            const increment = (interval / duration) * 100;

            const progressTimer = setInterval(() => {
                setProgress(prev => {
                    const next = prev + increment;
                    return next >= 100 ? 100 : next;
                });
            }, interval);

            return () => clearInterval(progressTimer);
        }
    }, [currentStage]);

    const CurrentIcon = stages[currentStage]?.icon;

    return (
        <div className="flex items-center gap-3 py-2">
            {/* Animated Icon Container */}
            <div className="relative flex items-center justify-center">
                {/* Circular Progress Ring */}
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    {/* Background circle */}
                    <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-muted"
                        strokeWidth="2"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-primary"
                        strokeWidth="2"
                        strokeDasharray="100"
                        initial={{ strokeDashoffset: 100 }}
                        animate={{
                            strokeDashoffset: 100 - progress,
                        }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Icon */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStage}
                        initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {CurrentIcon && (
                            <CurrentIcon
                                className="h-5 w-5 text-primary"
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Stage Label */}
            <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStage}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-0.5"
                    >
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {stages[currentStage]?.label}
                        </span>

                        {/* Stage Progress Dots */}
                        <div className="flex gap-1">
                            {stages.map((stage, idx) => (
                                <motion.div
                                    key={stage.id}
                                    className={`h-1 rounded-full transition-all duration-300 ${idx < currentStage
                                        ? 'bg-primary w-3'
                                        : idx === currentStage
                                            ? 'bg-primary/60 w-6'
                                            : 'bg-muted w-3'
                                        }`}
                                    initial={{ width: 12 }}
                                    animate={{
                                        width: idx === currentStage ? 24 : 12,
                                        opacity: idx <= currentStage ? 1 : 0.3
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pulse Effect - Always Active */}
            <motion.div
                className="absolute -inset-1 bg-primary/10 rounded-full blur-md -z-10"
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
}
