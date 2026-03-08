"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';
import { Link } from '@/i18n/routing';
import { CarCard } from './CarCard';

type Car = Database['public']['Tables']['cars']['Row'];

export function InventorySection() {
    const t = useTranslations('Inventory');
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        async function fetchCars() {
            setLoading(true);
            const { data, error } = await supabase
                .from('cars')
                .select('*')
                .eq('status', 'available')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setCars(data);
            }
            setLoading(false);
        }

        fetchCars();
    }, [supabase]);

    return (
        <section className="py-24 bg-surface-dark/50 border-t border-b border-white/5" id="inventory">
            <div className="container mx-auto px-4">
                <div className="flex flex-col mb-12">
                    <h2 className="text-3xl font-bold text-white">
                        <Link href="/inventory" className="hover:text-brand-red transition-colors">
                            {t('title')}
                        </Link>
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
                    </div>
                ) : cars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cars.map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface-card rounded-2xl border border-white/5">
                        <p className="text-text-dim text-lg">{t('noCars')}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
