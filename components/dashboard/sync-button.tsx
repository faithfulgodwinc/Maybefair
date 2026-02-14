'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { syncEmailsAction } from '@/app/actions/sync-emails';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export function SyncButton() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSync = async () => {
        setIsSyncing(true);
        setError(null);
        try {
            const result = await syncEmailsAction();
            if (result.error) {
                setError(result.error);
            } else {
                // Success - Confetti!
                console.log(`Synced ${result.count} emails`);
                triggerConfetti();
            }
        } catch (e) {
            setError('An error occurred.');
            console.error(e);
        } finally {
            setIsSyncing(false);
        }
    };

    const triggerConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            zIndex: 9999
        };

        function fire(particleRatio: number, opts: confetti.Options) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    };

    return (
        <div className="flex flex-col items-end">
            <Button
                onClick={handleSync}
                variant="outline"
                disabled={isSyncing}
                className="relative overflow-hidden group border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
            >
                <motion.div
                    animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ repeat: isSyncing ? Infinity : 0, duration: 1, ease: "linear" }}
                    className="mr-2"
                >
                    <RefreshCw className="h-4 w-4 text-primary" />
                </motion.div>
                <span className="relative z-10 font-medium tracking-wide">
                    {isSyncing ? 'Syncing...' : 'Sync Emails'}
                </span>

                {/* Subtle gradient background shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
            {error && <p className="text-xs text-red-500 mt-1 absolute top-full right-0">{error}</p>}
        </div>
    );
}
