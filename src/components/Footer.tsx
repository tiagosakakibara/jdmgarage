"use client";

import { Instagram, Facebook, Youtube, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('Navigation');

    return (
        <footer className="bg-black border-t border-white/10 py-12 text-sm text-text-dim">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-8">
                <div className="flex flex-col items-center text-center">
                    <h3 className="font-semibold text-white mb-6 uppercase text-xs tracking-wider">Follow Us</h3>
                    <div className="flex gap-4">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-card flex items-center justify-center hover:bg-brand-red hover:text-white transition-all text-text-dim">
                            <Instagram size={20} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-card flex items-center justify-center hover:bg-brand-red hover:text-white transition-all text-text-dim">
                            <Facebook size={20} />
                        </a>

                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-card flex items-center justify-center hover:bg-brand-red hover:text-white transition-all text-text-dim">
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 flex flex-col items-center justify-center text-center">
                <p>© {new Date().getFullYear()} JDM GARAGE JAPAN. All rights reserved.</p>
                <div className="mt-4 flex flex-col items-center gap-2">
                    <p className="text-xs text-white/50 italic tracking-wider">Designed for Performance.</p>
                    <a 
                        href="https://www.nippon-life.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-text-dim hover:text-white transition-all group"
                    >
                        <span>{t('nipponLifePartner')}</span>
                        <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
