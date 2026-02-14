import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto md:ml-64 transition-all duration-300">
                <div className="container mx-auto p-4 md:p-8 max-w-7xl min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
