"use client";

import { useState } from 'react';
import Image from 'next/image';

export function CarGallery({ images, alt }: { images: string[]; alt: string }) {
    const [activeImage, setActiveImage] = useState(images[0] || '');

    if (images.length === 0) return (
        <div className="relative aspect-[16/10] bg-surface-dark rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center text-text-dim">
            No Image
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Main Image */}
            <div className="relative aspect-[16/10] bg-surface-dark rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-500">
                <Image
                    src={activeImage}
                    alt={alt}
                    fill
                    priority
                    className="object-cover animate-in fade-in duration-500"
                    key={activeImage}
                />
            </div>

            {/* Thumbnail Grid */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {images.map((img, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setActiveImage(img)}
                            className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all duration-300 ${
                                activeImage === img 
                                    ? "border-brand-red scale-105 shadow-[0_0_15px_rgba(239,68,68,0.3)] z-10" 
                                    : "border-white/10 hover:border-white/30 grayscale-0 opacity-70 hover:opacity-100"
                            }`}
                        >
                            <Image
                                src={img}
                                alt={`${alt} view ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
