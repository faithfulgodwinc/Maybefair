import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs';
import { SyncButton } from '@/components/dashboard/sync-button';

export default async function Dashboard() {
    const supabase = await createClient();

    // Securely check for user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect('/login');
    }

    // Fetch emails from Supabase
    const { data: emails } = await supabase
        .from('emails')
        .select('*')
        .order('received_at', { ascending: false });

    // Fetch drafts
    const { data: drafts } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false });

    // Debug: Log email categories
    console.log('📊 [DASHBOARD] Fetched emails:', emails?.length || 0);
    console.log('📋 [DASHBOARD] Email categories:', emails?.map(e => ({
        subject: e.subject?.substring(0, 40),
        category: e.category
    })));

    const categorizedEmails = (category: string) =>
        (emails || []).filter((e) => e.category === category);

    return (
        <>
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8 border-b border-border/40 pb-4 sm:pb-6 mt-12 sm:mt-0">
                <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Executive Briefing</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • Status: Online</p>
                </div>
                <div className="flex items-center gap-4">
                    <SyncButton />
                </div>
            </header>

            <DashboardTabs emails={emails || []} drafts={drafts || []} />
        </>
    );
}
