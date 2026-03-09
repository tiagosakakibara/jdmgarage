import { ReactNode } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { logout } from '@/app/[locale]/(auth)/login/actions';

export default async function DashboardLayout({
    children,
    params
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <div className="flex min-h-screen bg-black">
            {/* Sidebar */}
            <aside className="w-64 bg-surface-card border-r border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white tracking-wider">
                        JDM<span className="text-brand-red"> ADMIN</span>
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href={`/${locale}/dashboard`} className="block px-4 py-2 text-text-dim hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        Overview
                    </Link>
                    <Link href={`/${locale}/dashboard/hero`} className="block px-4 py-2 text-text-dim hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        Hero Slider
                    </Link>
                    <Link href={`/${locale}/dashboard/cars`} className="block px-4 py-2 text-text-dim hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        Inventário (Cars)
                    </Link>
                    <Link href={`/${locale}/dashboard/services`} className="block px-4 py-2 text-text-dim hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        Serviços
                    </Link>
                </nav>
                <div className="p-4 border-t border-white/5">
                    <Link href={`/${locale}`} className="block px-4 py-2 mb-2 text-center text-sm text-text-dim hover:text-white border border-white/10 rounded-lg transition-colors">
                        Voltar ao Site
                    </Link>
                    <form action={logout}>
                        <button type="submit" className="w-full block px-4 py-2 text-center text-sm text-brand-red hover:text-white border border-brand-red/30 hover:border-brand-red rounded-lg transition-colors">
                            Sair do Dashboard
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
