"use client";

import { useTranslations } from 'next-intl';
import { ContactSection } from '@/components/ContactSection';

export default function ContactPage() {
    const t = useTranslations('ContactPage');

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <div className="relative h-[144px] md:h-[180px] flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                    style={{ 
                        backgroundImage: `url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop')`,
                        filter: 'brightness(0.3)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
                
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <h1 className="text-3xl md:text-6xl font-bold text-white mb-3 md:mb-4 tracking-tight uppercase italic">
                        {t('title')}
                    </h1>
                    <div className="w-16 md:w-20 h-1 bg-brand-red mx-auto mb-4"></div>
                    <p className="text-text-dim text-base md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            {/* Reuse Contact Section */}
            <div className="pb-8 md:pb-20">
                <ContactSection />
            </div>
            
            {/* Simple Map Embed for More Impact */}
            <div className="container mx-auto px-4 pb-12 md:pb-20">
                <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 h-[300px] md:h-[400px] w-full shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.3189635184276!2d136.1755763!3d34.8230721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600159e46a1da587%3A0xd6cd86997ddea723!2sJBM%20GARAGE!5e0!3m2!1spt-BR!2sjp!4v1773362799297!5m2!1spt-BR!2sjp" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="JDM Garage Location"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
