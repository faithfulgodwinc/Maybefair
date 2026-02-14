'use client';

import { motion } from 'framer-motion';

export function EmptyState({ title = "Nothing here", description = "You are all caught up!", icon = "✨" }: { title?: string, description?: string, icon?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut"
                }}
                className="w-24 h-24 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-neuro-raised"
            >
                <span className="text-4xl">{icon}</span>
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">{title}</h3>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">{description}</p>
        </motion.div>
    );
}
