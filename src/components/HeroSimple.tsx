"use client";

import React from 'react';
import { Link } from '@/i18n/routing';

interface HeroSlide {
    image: string;
    subtitle: string;
    subtitle_ja?: string | null;
    title1: string;
    title1_ja?: string | null;
    title2?: string | null;
    title2_ja?: string | null;
    description: string;
    description_ja?: string | null;
    primaryBtn: string;
    primaryBtn_ja?: string | null;
    secondaryBtn?: string | null;
    secondaryBtn_ja?: string | null;
    primaryLink?: string;
    secondaryLink?: string;
    showText?: boolean;
}

interface HeroSimpleProps {
    slides?: HeroSlide[];
    locale?: string;
}

export function HeroSimple({ slides, locale = 'pt' }: HeroSimpleProps) {
    // We only take the first slide for the simple hero
    const rawSlide = slides?.[0] || {
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2000',
        subtitle: 'Performance',
        title1: 'Precision Engineering.',
        title2: 'Timeless Design.',
        description: 'Excellence in every detail. Discover our curated selection of high-performance vehicles.',
        primaryBtn: 'Ver Estoque',
        primaryLink: '/inventory',
    };

    // Determine language fields based on locale
    const isJa = locale === 'ja';
    const slide = {
        ...rawSlide,
        subtitle: (isJa && rawSlide.subtitle_ja) || rawSlide.subtitle,
        title1: (isJa && rawSlide.title1_ja) || rawSlide.title1,
        title2: (isJa && rawSlide.title2_ja) || rawSlide.title2,
        description: (isJa && rawSlide.description_ja) || rawSlide.description,
        primaryBtn: (isJa && rawSlide.primaryBtn_ja) || rawSlide.primaryBtn,
        secondaryBtn: (isJa && rawSlide.secondaryBtn_ja) || rawSlide.secondaryBtn,
    };

    return (
        <section className={`relative h-[240px] md:h-[336px] flex items-center justify-center overflow-hidden bg-black text-center ${isJa ? 'font-noto' : ''}`}>
            {/* Background Image - Adjusted vertical position to show the car more */}
            <div 
                className="absolute inset-0 bg-cover bg-[center_75%] bg-no-repeat z-0"
                style={{ 
                    backgroundImage: `url('${slide.image}')`,
                    filter: 'brightness(0.6)'
                }}
            />
            
            {/* Cinematic Gradient Overlay - lighter in the middle */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10" />
            
            {/* Content Container */}
            <div className="container mx-auto px-6 relative z-20">
                {slide.showText !== false && (
                    <>
                        <span className="inline-block text-brand-red font-semibold uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4 drop-shadow-md">
                            {slide.subtitle}
                        </span>
                        
                        <h1 className={`${isJa ? 'text-2xl sm:text-3xl md:text-6xl' : 'text-3xl sm:text-4xl md:text-7xl'} font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight`}>
                            {slide.title1}
                            {slide.title2 && (
                                <>
                                    <br className="hidden sm:block" />{" "}
                                    <span className="text-brand-red">{slide.title2}</span>
                                </>
                            )}
                        </h1>
                        
                        <p className="text-text-dim text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10 line-clamp-3 md:line-clamp-none">
                            {slide.description}
                        </p>
                        
                        {/* Buttons removed per request */}
                    </>
                )}
            </div>
            
            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-15" />
        </section>
    );
}
