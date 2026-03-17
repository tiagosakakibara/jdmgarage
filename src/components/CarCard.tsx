"use client";

import { useTranslations } from 'next-intl';
import { Database } from '@/types/supabase';
import { default as NextImage } from 'next/image';
import { Link } from '@/i18n/routing';

type Car = Database['public']['Tables']['cars']['Row'];

interface CarCardProps {
    car: Car;
}

export function CarCard({ car }: CarCardProps) {
    const t = useTranslations('Inventory');

    // Format price (assuming yen, so roughly ¥19,800,000)
    const formattedPrice = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
    }).format(car.price);

    return (
        <Link href={`/inventory/${car.id}`} className="bg-surface-card border border-white/5 rounded-xl overflow-hidden group hover:border-brand-red/50 transition-colors flex flex-col h-full cursor-pointer">
            <div className="relative h-48 w-full bg-surface-dark overflow-hidden">
                {car.featured_image ? (
                    <NextImage
                        src={car.featured_image}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-text-dim/50">
                        No Image
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-text-dim mb-2 uppercase tracking-wider">{car.year} {car.brand}</div>
                <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{car.brand} {car.model}</h3>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="text-brand-red font-bold text-lg">{formattedPrice}</div>
                    <span className="text-text-dim group-hover:text-brand-red transition-colors text-sm font-medium flex items-center gap-2">
                        {t('viewDetails')}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                </div>
            </div>
        </Link>
    );
}
