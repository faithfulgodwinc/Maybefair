'use client'

import { useState } from 'react';
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileMenu } from "@/components/dashboard/mobile-menu";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
            {/* Mobile Hamburger Menu */}
            <MobileMenu isOpen={isMobileMenuOpen} onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

            {/* Sidebar Navigation */}
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto ml-0 md:ml-16 lg:ml-64 transition-all duration-300">
                <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
