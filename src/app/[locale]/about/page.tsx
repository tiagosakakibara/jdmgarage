"use client";

import { useTranslations } from 'next-intl';
import { Target, History, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function AboutPage() {
    const t = useTranslations('AboutPage');

    const values = [
        {
            icon: <CheckCircle className="w-10 h-10 text-brand-red" />,
            title: t('value1Title'),
            description: t('value1Desc'),
        },
        {
            icon: <Target className="w-10 h-10 text-brand-red" />,
            title: t('value2Title'),
            description: t('value2Desc'),
        },
        {
            icon: <Heart className="w-10 h-10 text-brand-red" />,
            title: t('value3Title'),
            description: t('value3Desc'),
        }
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105"
                    style={{ 
                        backgroundImage: `url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop')`,
                        filter: 'brightness(0.3)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
                
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tighter uppercase italic">
                        {t('title')}
                    </h1>
                    <div className="w-24 h-1 bg-brand-red mx-auto mb-6"></div>
                    <p className="text-text-dim text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <section className="py-24 container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <div className="inline-flex items-center gap-2 text-brand-red font-bold uppercase tracking-widest text-sm mb-4">
                            <History size={20} />
                            <span>{t('storyTitle')}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 border-l-4 border-brand-red pl-6">
                            Traditão & <span className="text-brand-red">Excelência</span>
                        </h2>
                        <div className="space-y-6 text-text-dim text-lg leading-relaxed">
                            <p>{t('storyDescription')}</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 relative">
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl skew-x-[-2deg]">
                            <img 
                                src="https://images.unsplash.com/photo-1614200171351-412f8626786a?q=80&w=1974&auto=format&fit=crop" 
                                alt="JDM Culture" 
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/20 to-transparent mix-blend-overlay"></div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-brand-red opacity-30"></div>
                    </div>
                </div>
            </section>

            {/* Mission Section - High Impact */}
            <section className="bg-surface-dark py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-red/5 skew-x-[-20deg] translate-x-1/2"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-brand-red font-bold uppercase tracking-[0.3em] text-sm mb-6">{t('missionTitle')}</h2>
                    <p className="text-3xl md:text-5xl text-white font-bold max-w-5xl mx-auto leading-tight italic">
                        "{t('missionDescription')}"
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {t('valuesTitle')}
                    </h2>
                    <p className="text-text-dim">O que nos move todos os dias.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((v, i) => (
                        <div key={i} className="bg-surface-card border border-white/5 p-10 rounded-3xl hover:border-brand-red/30 transition-all duration-300 transform hover:-translate-y-2 group">
                            <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                                {v.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">{v.title}</h3>
                            <p className="text-text-dim leading-relaxed">
                                {v.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="pb-32 container mx-auto px-4">
                <div className="relative rounded-[3rem] overflow-hidden p-12 md:p-24 text-center">
                    <div className="absolute inset-0 bg-brand-red z-0"></div>
                    <div className="absolute inset-0 bg-black/20 z-10"></div>
                    {/* Pattern background */}
                    <div className="absolute inset-0 opacity-10 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                    
                    <div className="relative z-20">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter">
                            Pronto para acelerar?
                        </h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <Link 
                                href="/inventory" 
                                className="bg-white text-brand-red hover:bg-black hover:text-white px-10 py-5 rounded-2xl font-black text-xl transition-all duration-500 flex items-center justify-center gap-4 group"
                            >
                                VER ESTOQUE
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link 
                                href="/contact" 
                                className="bg-black text-white hover:bg-white hover:text-brand-red px-10 py-5 rounded-2xl font-black text-xl transition-all duration-500"
                            >
                                FALAR CONOSCO
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
