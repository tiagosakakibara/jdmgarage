"use client";

import { useTranslations } from 'next-intl';
import { Database } from '@/types/supabase';
import { default as NextImage } from 'next/image';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Car = Database['public']['Tables']['cars']['Row'];

interface CarCardProps {
    car: Car;
}

export function CarCard({ car }: CarCardProps) {
    const t = useTranslations('Inventory');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Filter valid images
    // @ts-ignore
    const allImages = Array.from(new Set([car.featured_image, ...(car.images || [])])).filter((img): img is string => !!img);

    const priceLocale = 'ja-JP'; // Can be improved later but keeping it standard
    const formattedPrice = new Intl.NumberFormat(priceLocale, {
        style: 'currency',
        currency: 'JPY',
    }).format(car.price);

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    return (
        <Link href={`/inventory/${car.id}`} className="bg-surface-card border border-white/5 rounded-2xl overflow-hidden group hover:border-brand-red/40 transition-all duration-300 flex flex-col h-full cursor-pointer hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <div className="relative h-56 w-full bg-surface-dark overflow-hidden">
                {allImages.length > 0 ? (
                    <div className="relative w-full h-full">
                        <NextImage
                            src={allImages[currentImageIndex]}
                            alt={`${car.brand} ${car.model}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            key={allImages[currentImageIndex]}
                        />
                        
                        {/* Interactive Arrows on Hover */}
                        {allImages.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button 
                                    onClick={handlePrev}
                                    className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-brand-red transition-colors border border-white/10"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button 
                                    onClick={handleNext}
                                    className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-brand-red transition-colors border border-white/10"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* Pagination Indicator */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {allImages.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-4 bg-brand-red' : 'w-1 bg-white/40'}`} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-text-dim/50 bg-black/20 italic text-sm">
                        Sem Imagens
                    </div>
                )}
                
                {/* Year Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-white shadow-xl">
                    {car.year}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="text-[10px] text-brand-red mb-1 uppercase tracking-[0.2em] font-bold opacity-80">{car.brand}</div>
                <h3 className="text-xl font-bold text-white mb-4 line-clamp-1 group-hover:text-brand-red transition-colors">{car.model}</h3>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="text-white font-black text-lg tracking-tight group-hover:scale-110 transition-transform origin-left">{formattedPrice}</div>
                    <span className="text-text-dim group-hover:text-brand-red transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        {t('viewDetails')}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                </div>
            </div>
        </Link>
    );
}
