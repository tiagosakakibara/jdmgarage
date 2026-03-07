"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { User, Store } from 'lucide-react';

import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
    const t = useTranslations('Navigation');

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-surface-dark/90 backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold flex items-center gap-2 text-white">
                    <span className="text-brand-red">JDM</span> GARAGE
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-dim">
                    <Link href="/" className="hover:text-white transition-colors">{t('top')}</Link>
                    <Link href="/services" className="hover:text-white transition-colors">{t('services')}</Link>
                    <Link href="/inventory" className="hover:text-white transition-colors">{t('carSales')}</Link>
                    <Link href="/about" className="hover:text-white transition-colors">{t('company')}</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">{t('contact')}</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <button className="text-text-dim hover:text-white transition-colors p-2 hidden sm:block">
                        <User size={20} />
                    </button>
                    <button className="text-text-dim hover:text-white transition-colors p-2 hidden sm:block">
                        <Store size={20} />
                    </button>
                    <Link
                        href="/contact"
                        className="bg-brand-red text-white px-6 py-2 rounded font-medium hover:bg-rose-700 transition-colors"
                    >
                        {t('getQuote')}
                    </Link>
                </div>
            </div>
        </header>
    );
}
