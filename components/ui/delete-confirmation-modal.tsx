'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    loading?: boolean;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Draft?",
    description = "Are you sure you want to delete this draft? This action cannot be undone.",
    loading = false,
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 p-6 pb-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-foreground">
                                        {title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border">
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="h-9"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="h-9 shadow-sm"
                                >
                                    {loading ? 'Deleting...' : 'Yes, delete'}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
