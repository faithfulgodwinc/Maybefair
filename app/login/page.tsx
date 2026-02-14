import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from './login-button'
import { ShieldCheck, Zap } from 'lucide-react'

export default async function Login() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
        redirect('/dashboard')
    }

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Panel - The Brand Experience */}
            <div className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center p-12 overflow-hidden">
                {/* Abstract Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-40 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 max-w-lg text-primary-foreground">
                    <div className="mb-8 flex items-center gap-3 opacity-90">
                        <div className="h-8 w-8 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center">
                            <span className="font-mono font-bold text-white">M</span>
                        </div>
                        <span className="font-mono text-sm tracking-widest uppercase">Maybefair</span>
                    </div>

                    <h1 className="text-5xl font-serif font-bold tracking-tight mb-6 leading-tight">
                        Your Executive<br />Advantage.
                    </h1>

                    <p className="text-lg text-primary-foreground/80 leading-relaxed font-light mb-12 max-w-md">
                        Quiet the noise. Focus on what matters. Maybefair intelligent filtering and drafting gives you back 2 hours every day.
                    </p>

                    <div className="flex gap-8 text-sm font-medium opacity-70">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Enterprise Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span>AI Powered</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - The Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
                <div className="w-full max-w-[360px] space-y-8 flex flex-col items-center text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                            Welcome back
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Sign in to access your executive briefing.
                        </p>
                    </div>

                    <div className="py-2 w-full">
                        <LoginButton />
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-xs mx-auto">
                        By continuing, you acknowledge that Maybefair uses AI to process your data for productivity enhancements.
                        <br className="hidden sm:block" />
                        <a href="#" className="underline decoration-muted-foreground/40 hover:text-foreground hover:decoration-foreground transition-all">Terms</a> &bull; <a href="#" className="underline decoration-muted-foreground/40 hover:text-foreground hover:decoration-foreground transition-all">Privacy</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
