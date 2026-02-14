'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { getUnreadMessageIds, syncBatch } from '@/app/actions/sync-emails';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

export function SyncButton() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>('');
    const [total, setTotal] = useState(0);

    const handleSync = async () => {
        setIsSyncing(true);
        setProgress(5);
        setStatus('Checking for emails...');

        try {
            // 1. Get IDs
            const result = await getUnreadMessageIds();

            if (result.error) {
                console.error(result.error);
                setStatus('Failed to connect');
                setTimeout(() => setIsSyncing(false), 2000);
                return;
            }

            const ids = result.ids || [];

            if (ids.length === 0) {
                setProgress(100);
                setStatus('Up to date!');
                setTimeout(() => setIsSyncing(false), 2000);
                return;
            }

            setTotal(ids.length);
            setStatus(`Found ${ids.length} new emails`);
            setProgress(10);

            // 2. Process in chunks
            const CHUNK_SIZE = 5;
            let processed = 0;

            for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
                const chunk = ids.slice(i, i + CHUNK_SIZE);
                setStatus(`Syncing ${processed + 1}-${Math.min(processed + chunk.length, ids.length)} of ${ids.length}...`);

                await syncBatch(chunk);

                processed += chunk.length;
                setProgress(10 + (processed / ids.length) * 90);
            }

            setStatus('Done!');
            setProgress(100);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (err) {
            console.error("Sync failed:", err);
            setStatus('Sync failed!');
            setProgress(0);
        } finally {
            // Keep status message for a bit, then reset
            setTimeout(() => {
                setIsSyncing(false);
                setStatus('');
                setProgress(0);
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-[200px]">
            <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing}
                className="gap-2 relative overflow-hidden transition-all duration-300"
            >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? (status || 'Syncing...') : 'Sync Emails'}
            </Button>

            <AnimatePresence>
                {isSyncing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full"
                    >
                        <Progress value={progress} className="h-1.5 w-full mt-2" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
