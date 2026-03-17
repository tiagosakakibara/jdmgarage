"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CarGallery({ images, alt }: { images: string[]; alt: string }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) return (
        <div className="relative aspect-[16/10] bg-surface-dark rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center text-text-dim">
            No Image
        </div>
    );

    const handlePrevious = () => {
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const currentImage = images[activeIndex];

    return (
        <div className="flex flex-col gap-6">
            {/* Main Image */}
            <div className="relative aspect-[16/10] bg-surface-dark rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                <Image
                    src={currentImage}
                    alt={alt}
                    fill
                    priority
                    className="object-cover animate-in fade-in duration-700"
                    key={currentImage}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-red hover:scale-110 z-20"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-red hover:scale-110 z-20"
                            aria-label="Next image"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Image Counter Badge */}
                        <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-xs font-bold tracking-widest text-white/90 z-20">
                            {activeIndex + 1} / {images.length}
                        </div>
                    </>
                )}

                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>

            {/* Thumbnail Grid */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                    {images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveIndex(idx)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-500 overflow-hidden ${
                                activeIndex === idx 
                                    ? "border-brand-red scale-105 shadow-[0_0_20px_rgba(239,68,68,0.4)] z-10" 
                                    : "border-transparent hover:border-white/30 opacity-40 hover:opacity-100 scale-95 hover:scale-100"
                            }`}
                        >
                            <Image
                                src={img}
                                alt={`${alt} view ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
