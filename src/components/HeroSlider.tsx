'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/routing';


interface HeroSlide {
    image: string;
    subtitle: string;
    title1: string;
    title2?: string;
    description: string;
    primaryBtn: string;
    secondaryBtn?: string;
    primaryLink?: string;
    secondaryLink?: string;
    showText?: boolean;
}

interface HeroSliderProps {
    slides?: HeroSlide[];
    locale?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
    {
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2000',
        subtitle: 'Performance',
        title1: 'Precision Engineering.',
        title2: 'Timeless Design.',
        description: 'Excellence in every detail. Discover our curated selection of high-performance vehicles, engineered to thrill.',
        primaryBtn: 'Ver Estoque',
    },
];

const SLICES_COUNT = 12;
const TRANSITION_DURATION = 1400; // ms

export function HeroSlider({ slides = DEFAULT_SLIDES, locale = 'pt' }: HeroSliderProps) {
    const router = useRouter();
    const isJa = locale === 'ja';
    const [activeIndex, setActiveIndex] = useState(0);
    const [transitioningToIndex, setTransitioningToIndex] = useState<number | null>(null);
    const [startAnim, setStartAnim] = useState(false);

    // Autoplay & Hover
    const [isHovered, setIsHovered] = useState(false);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = () => {
        if (transitioningToIndex !== null) return;
        const next = (activeIndex + 1) % slides.length;
        triggerTransition(next);
    };

    const prevSlide = () => {
        if (transitioningToIndex !== null) return;
        const prev = (activeIndex - 1 + slides.length) % slides.length;
        triggerTransition(prev);
    };

    const goToSlide = (index: number) => {
        if (transitioningToIndex !== null || index === activeIndex) return;
        triggerTransition(index);
    };

    const triggerTransition = (nextIndex: number) => {
        setTransitioningToIndex(nextIndex);

        setTimeout(() => {
            setStartAnim(true);
            setTimeout(() => {
                setActiveIndex(nextIndex);
                setTransitioningToIndex(null);
                setStartAnim(false);
            }, TRANSITION_DURATION);
        }, 30);
    };

    // Autoplay effect
    useEffect(() => {
        if (isHovered) {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
            return;
        }
        autoplayRef.current = setInterval(() => {
            nextSlide();
        }, 5000); // 5s per slide

        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [activeIndex, transitioningToIndex, isHovered]);

    // Swipe handling
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const distance = touchStart - touchEnd;
        if (distance > 50) nextSlide();
        if (distance < -50) prevSlide();
        setTouchStart(null);
    };

    const currentSlide = slides[activeIndex];
    const nextSlideData = transitioningToIndex !== null ? slides[transitioningToIndex] : null;

    return (
        <section className={`w-full bg-black flex justify-center border-b border-surface-card bg-surface-dark/20 ${isJa ? 'font-noto' : ''}`}>
            <div
                onClick={() => currentSlide.primaryLink && router.push(currentSlide.primaryLink as any)}
                className={`relative w-full max-w-[1504px] overflow-hidden bg-black flex items-center justify-center transition-all duration-500 h-[280px] md:h-auto md:aspect-[1504/640] ${currentSlide.primaryLink ? 'cursor-pointer' : 'cursor-default'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Base Image (Current Slide) */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${currentSlide.image})`,
                        backgroundPosition: 'center 60%',
                        imageRendering: 'crisp-edges',
                        transform: 'translateZ(0)'
                    }}
                />

                {/* Mechanical Transition Slices */}
                {transitioningToIndex !== null && nextSlideData && (
                    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                        {Array.from({ length: SLICES_COUNT }).map((_, i) => {
                            // Delay calculated for stagger, e.g. 0ms to 400ms spread
                            const delay = i * (400 / SLICES_COUNT);
                            return (
                                <div
                                    key={i}
                                    className="absolute top-0 bottom-0"
                                    style={{
                                        left: `${(i * 100) / SLICES_COUNT}%`,
                                        width: `${100 / SLICES_COUNT}%`,
                                        perspective: '1200px'
                                    }}
                                >
                                    <div
                                        className="w-full h-full origin-left"
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            // initial state: rotated -90deg on Y axis, invisible
                                            transform: startAnim ? 'rotateY(0deg) scale(1)' : 'rotateY(-90deg) scale(0.95)',
                                            opacity: startAnim ? 1 : 0,
                                            transition: `transform 0.9s cubic-bezier(0.76, 0, 0.24, 1) ${delay}ms, opacity 0.5s ease ${delay}ms`
                                        }}
                                    >
                                        <div
                                            className="absolute top-0 bottom-0 bg-cover bg-no-repeat"
                                            style={{
                                                width: `${SLICES_COUNT * 100}%`,
                                                left: `${-i * 100}%`,
                                                backgroundImage: `url(${nextSlideData.image})`,
                                                backgroundPosition: 'center 60%',
                                                imageRendering: 'crisp-edges',
                                                transform: 'translateZ(0)'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Gradient Overlay for legibility & cinematic vignette */}
                {currentSlide.showText !== false && (
                    <>
                        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                        <div className="absolute inset-0 z-20 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)] pointer-events-none" />

                        {/* Content Container */}
                        <div className="container mx-auto px-4 md:px-12 relative z-30 h-full flex flex-col justify-center items-start md:items-center">
                            <div className="max-w-2xl py-4 sm:py-8 mt-[-30px] md:mt-0 text-left md:text-center">
                                {/* Animated Content wrapper synced with transitions */}
                                <div
                                    className={`transition-all duration-700 ease-out transform ${transitioningToIndex !== null ? 'opacity-0 translate-y-8 blur-sm' : 'opacity-100 translate-y-0 blur-0'
                                        }`}
                                >
                                    <span className="inline-block text-brand-red font-semibold uppercase tracking-widest text-xs sm:text-sm md:text-base mb-2 md:mb-4 drop-shadow-md">
                                        {currentSlide.subtitle}
                                    </span>

                                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-lg mb-2 md:mb-4">
                                        {currentSlide.title1}
                                        {currentSlide.title2 && (
                                            <>
                                                <br />
                                                <span className="text-brand-red/90">{currentSlide.title2}</span>
                                            </>
                                        )}
                                    </h1>

                                    <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl mb-4 md:mb-6 drop-shadow-md leading-relaxed line-clamp-2 md:line-clamp-3 mx-0 md:mx-auto">
                                        {currentSlide.description}
                                    </p>

                                    {/* Buttons removed per request */}

                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Navigation Elements */}
                <div className="absolute bottom-4 md:bottom-8 left-0 right-0 z-40 flex justify-between items-center px-4 md:px-12 container mx-auto">
                    {/* Progress Indicators / Dots */}
                    <div className="flex gap-2 md:gap-3">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); goToSlide(idx); }}
                                aria-label={`Go to slide ${idx + 1}`}
                                className="group relative flex items-center h-8 z-50"
                            >
                                <span
                                    className={`block h-[3px] transition-all duration-500 rounded-full ${idx === activeIndex
                                        ? 'w-12 bg-brand-red'
                                        : 'w-6 bg-white/40 group-hover:bg-white/70'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Arrows - Hidden on mobile, visible on sm and up */}
                    <div className="hidden sm:flex gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm relative z-50"
                            aria-label="Previous slide"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm relative z-50"
                            aria-label="Next slide"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
