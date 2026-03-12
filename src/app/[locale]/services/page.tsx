"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Wrench, Zap, CheckCircle, Phone } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { createClient } from '@/utils/supabase/client';

export default function ServicesPage() {
    const t = useTranslations('ServicesPage');
    const [images, setImages] = useState<Record<string, string>>({
        hero: "/images/services/hero.jpg",
        shaken: "/images/services/shaken.jpg",
        maintenance: "/images/services/maintenance.jpg",
        customization: "/images/services/customization.jpg",
    });

    useEffect(() => {
        const fetchImages = async () => {
            const supabase = createClient();
            const { data } = await supabase.from('service_content').select('section_key, image_url');
            if (data) {
                const newImages = { ...images };
                data.forEach(item => {
                    newImages[item.section_key] = item.image_url;
                });
                setImages(newImages);
            }
        };
        fetchImages();
    }, []);

    const services = [
        {
            id: 'shaken',
            icon: <ShieldCheck className="w-12 h-12 text-brand-red" />,
            title: t('shaken.title'),
            description: t('shaken.description'),
            features: [
                t('shaken.features.0'),
                t('shaken.features.1'),
                t('shaken.features.2'),
                t('shaken.features.3')
            ],
            image: images.shaken
        },
        {
            id: 'maintenance',
            icon: <Wrench className="w-12 h-12 text-brand-red" />,
            title: t('maintenance.title'),
            description: t('maintenance.description'),
            features: [
                t('maintenance.features.0'),
                t('maintenance.features.1'),
                t('maintenance.features.2'),
                t('maintenance.features.3')
            ],
            image: images.maintenance
        },
        {
            id: 'customization',
            icon: <Zap className="w-12 h-12 text-brand-red" />,
            title: t('customization.title'),
            description: t('customization.description'),
            features: [
                t('customization.features.0'),
                t('customization.features.1'),
                t('customization.features.2'),
                t('customization.features.3')
            ],
            image: images.customization
        }
    ];

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                    style={{ 
                        backgroundImage: `url('${images.hero}')`,
                        filter: 'brightness(0.3)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
                
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-text-dim text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            {/* Services List */}
            <div className="container mx-auto px-4 -mt-10 relative z-30">
                <div className="space-y-24">
                    {services.map((service, index) => (
                        <div 
                            key={service.id} 
                            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}
                        >
                            {/* Image Side */}
                            <div className="w-full md:w-1/2 group">
                                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${service.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-1/2">
                                <div className="p-2 inline-block bg-brand-red/10 rounded-xl mb-6 shadow-inner">
                                    {service.icon}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    {service.title}
                                </h2>
                                <p className="text-text-dim text-lg mb-8 leading-relaxed">
                                    {service.description}
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {service.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-3 text-white/80">
                                            <CheckCircle size={18} className="text-brand-red flex-shrink-0" />
                                            <span className="text-sm md:text-base font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 mt-32">
                <div className="bg-surface-card border border-white/10 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent" />
                    <div className="absolute bottom-0 right-0 -mb-12 -mr-12 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl group-hover:bg-brand-red/10 transition-colors duration-500" />
                    
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                        {t('ctaTitle')}
                    </h2>
                    <p className="text-text-dim text-lg mb-10 max-w-2xl mx-auto relative z-10">
                        {t('ctaDesc')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <a
                            href="tel:09017265361"
                            className="bg-brand-red hover:bg-white text-white hover:text-brand-red px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1 shadow-xl shadow-brand-red/20"
                        >
                            <Phone size={24} />
                            090-1726-5361
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
