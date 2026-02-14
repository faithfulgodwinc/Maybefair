'use client'

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="md:hidden fixed top-3 left-3 z-[60] h-11 w-11 bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-background"
            aria-label={isOpen ? "Close menu" : "Open menu"}
        >
            {isOpen ? (
                <X className="h-5 w-5" />
            ) : (
                <Menu className="h-5 w-5" />
            )}
        </Button>
    );
}
