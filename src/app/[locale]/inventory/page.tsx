"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';
import { CarCard } from '@/components/CarCard';
import { Link } from '@/i18n/routing';
import { Car, Phone } from 'lucide-react';

type CarType = Database['public']['Tables']['cars']['Row'];

export default function InventoryPage() {
    const t = useTranslations('InventoryPage');
    const tInv = useTranslations('Inventory');
    const [cars, setCars] = useState<CarType[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        async function fetchCars() {
            setLoading(true);
            const { data, error } = await supabase
                .from('cars')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setCars(data);
            }
            setLoading(false);
        }

        fetchCars();
    }, [supabase]);

    return (
        <div className="min-h-screen bg-black pt-24 pb-20">
            {/* Header Section */}
            <div className="container mx-auto px-4 mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-text-dim text-lg max-w-2xl">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Inventory Grid Section */}
            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-red border-r-transparent border-b-transparent border-l-transparent"></div>
                    </div>
                ) : cars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cars.map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface-card rounded-2xl border border-white/5">
                        <p className="text-text-dim text-lg">
                            {tInv('noCars')}
                        </p>
                    </div>
                )}
            </div>

            {/* CTA Section - Sell Your Car */}
            <div className="container mx-auto px-4 mt-24">
                <div className="bg-gradient-to-br from-brand-red/10 to-transparent border border-brand-red/20 rounded-2xl p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 text-brand-red/5 transition-transform duration-700 group-hover:scale-110">
                        <Car size={300} />
                    </div>
                    
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            {t('sellYourCar')}
                        </h2>
                        <p className="text-text-dim mb-8 text-lg">
                            {t('sellYourCarDesc')}
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-brand-red hover:bg-white text-white hover:text-brand-red font-bold py-3 px-8 rounded-lg transition-all duration-300"
                        >
                            {t('contactUs')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
