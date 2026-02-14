import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {/* Header with Back Button */}
            <header className="border-b border-border/40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Button>
                        </Link>
                        <span className="text-sm font-semibold text-muted-foreground">Maybefair</span>
                    </div>
                </div>
            </header>

            {/* Privacy Policy Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-border/40 p-8 sm:p-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground mb-8">
                        <strong>Effective Date:</strong> February 14, 2026 • <strong>Last Updated:</strong> February 14, 2026
                    </p>

                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        {/* Introduction */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">Introduction</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Welcome to <strong>Maybefair</strong>, your AI-powered executive assistant. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our service.
                            </p>
                        </section>

                        {/* 1. Information We Collect */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>

                            <h3 className="text-lg font-medium text-foreground mb-2 mt-4">1.1 Information You Provide</h3>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Google Account Information:</strong> When you sign in with Google, we collect your name, email address, and profile picture.</li>
                                <li><strong>Email Data:</strong> We access your Gmail inbox to fetch unread emails for classification and draft generation. We do <strong>not</strong> store the full content of your emails permanently.</li>
                            </ul>

                            <h3 className="text-lg font-medium text-foreground mb-2 mt-4">1.2 Automatically Collected Information</h3>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Email Metadata:</strong> Subject lines, sender information, snippets, and timestamps.</li>
                                <li><strong>AI-Generated Drafts:</strong> Draft replies created by our AI assistant.</li>
                                <li><strong>Usage Data:</strong> Information about how you interact with the app (e.g., which emails you view, drafts you generate).</li>
                            </ul>

                            <h3 className="text-lg font-medium text-foreground mb-2 mt-4">1.3 Information from Third Parties</h3>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Google APIs:</strong> We use Google Gmail and Calendar APIs to access your emails and calendar events with your explicit permission.</li>
                            </ul>
                        </section>

                        {/* 2. How We Use Your Information */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground mb-2">We use your information to:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Classify Emails:</strong> Automatically categorize your emails (urgent, meetings, questions, newsletters, etc.) using AI.</li>
                                <li><strong>Generate Draft Replies:</strong> Create intelligent draft responses to your emails.</li>
                                <li><strong>Sync Calendar:</strong> Display your upcoming meetings and schedule.</li>
                                <li><strong>Improve Our Service:</strong> Analyze usage patterns to enhance app functionality.</li>
                            </ul>
                        </section>

                        {/* 3. Data Storage and Security */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Storage and Security</h2>

                            <h3 className="text-lg font-medium text-foreground mb-2 mt-4">3.1 Where We Store Your Data</h3>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Supabase:</strong> We use Supabase (a secure, SOC 2 Type II certified platform) to store email metadata, drafts, and user profiles.</li>
                                <li><strong>Google Servers:</strong> Your full email content remains on Google's servers. We only fetch it temporarily for processing.</li>
                            </ul>

                            <h3 className="text-lg font-medium text-foreground mb-2 mt-4">3.2 How We Protect Your Data</h3>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Encryption:</strong> All data is encrypted in transit (HTTPS/TLS) and at rest.</li>
                                <li><strong>Access Control:</strong> Only you can access your data. We do not share your information with third parties.</li>
                                <li><strong>No Permanent Storage:</strong> Full email bodies are <strong>not</strong> stored in our database—only metadata and snippets.</li>
                            </ul>
                        </section>

                        {/* 4. Data Sharing */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Sharing and Disclosure</h2>
                            <p className="text-muted-foreground mb-2">
                                We <strong>do not sell, rent, or share</strong> your personal information with third parties, except:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>With Your Consent:</strong> If you explicitly authorize us to share data.</li>
                                <li><strong>Legal Compliance:</strong> If required by law, court order, or government regulation.</li>
                                <li><strong>Service Providers:</strong> We use trusted third-party services (Google, Supabase, Gemini AI) to operate our app. These providers are bound by strict confidentiality agreements.</li>
                            </ul>
                        </section>

                        {/* 5. Your Rights */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights and Choices</h2>
                            <p className="text-muted-foreground mb-2">You have the right to:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Access Your Data:</strong> View all data we've collected about you.</li>
                                <li><strong>Delete Your Data:</strong> Request deletion of your account and all associated data.</li>
                                <li><strong>Revoke Access:</strong> Disconnect Maybefair from your Google account at any time via <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Account Permissions</a>.</li>
                                <li><strong>Opt-Out:</strong> Stop using the service at any time by signing out.</li>
                            </ul>
                            <p className="text-muted-foreground mt-3">
                                To exercise these rights, contact us at <a href="mailto:faithfulgodwinc@gmail.com" className="text-primary hover:underline">faithfulgodwinc@gmail.com</a> or use the settings page in the app.
                            </p>
                        </section>

                        {/* 6. Data Retention */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Retention</h2>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Email Metadata:</strong> Stored until you delete your account or manually remove emails from the app.</li>
                                <li><strong>AI Drafts:</strong> Stored until you delete them or your account.</li>
                                <li><strong>Account Data:</strong> Deleted within 30 days of account deletion request.</li>
                            </ul>
                        </section>

                        {/* 7. Third-Party Services */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">7. Third-Party Services</h2>
                            <p className="text-muted-foreground mb-2">We integrate with:</p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li><strong>Google (Gmail, Calendar):</strong> Subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's Privacy Policy</a>.</li>
                                <li><strong>Supabase:</strong> Subject to <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase's Privacy Policy</a>.</li>
                                <li><strong>Google Gemini AI:</strong> Used for email classification and draft generation. Subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's AI Privacy Policy</a>.</li>
                            </ul>
                            <p className="text-muted-foreground mt-3">
                                We are not responsible for the privacy practices of these third parties.
                            </p>
                        </section>

                        {/* 8. Children's Privacy */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">8. Children's Privacy</h2>
                            <p className="text-muted-foreground">
                                Maybefair is <strong>not intended for users under 18 years of age</strong>. We do not knowingly collect data from children. If you believe a child has provided us with personal information, please contact us immediately.
                            </p>
                        </section>

                        {/* 9. Changes to Policy */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to This Privacy Policy</h2>
                            <p className="text-muted-foreground mb-2">
                                We may update this Privacy Policy from time to time. We will notify you of significant changes by:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                                <li>Posting the updated policy on this page.</li>
                                <li>Updating the "Last Updated" date.</li>
                                <li>Sending an email notification (if you've opted in).</li>
                            </ul>
                            <p className="text-muted-foreground mt-3">
                                Your continued use of Maybefair after changes constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        {/* 10. Contact */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact Us</h2>
                            <p className="text-muted-foreground mb-2">
                                If you have questions or concerns about this Privacy Policy, please contact us:
                            </p>
                            <ul className="list-none text-muted-foreground space-y-1">
                                <li><strong>Email:</strong> <a href="mailto:faithfulgodwinc@gmail.com" className="text-primary hover:underline">faithfulgodwinc@gmail.com</a></li>
                                <li><strong>Website:</strong> <a href="https://maybefair.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://maybefair.vercel.app</a></li>
                            </ul>
                        </section>

                        {/* 11. Google API Disclosure */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-3">11. Google API Disclosure</h2>
                            <p className="text-muted-foreground">
                                Maybefair's use and transfer of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
                            </p>
                        </section>

                        {/* Acknowledgment */}
                        <div className="bg-muted/30 border border-border/40 rounded-lg p-6 mt-8">
                            <p className="text-sm text-muted-foreground text-center">
                                <strong>By using Maybefair, you acknowledge that you have read and understood this Privacy Policy.</strong>
                            </p>
                        </div>
                    </div>

                    {/* Back to Login Button */}
                    <div className="mt-12 flex justify-center">
                        <Link href="/login">
                            <Button size="lg" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 py-6 mt-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <p className="text-center text-sm text-muted-foreground">
                        © 2026 Maybefair. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
