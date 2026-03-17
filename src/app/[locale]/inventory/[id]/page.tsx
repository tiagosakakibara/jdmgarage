import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { 
    ChevronLeft, 
    Calendar, 
    Gauge, 
    Settings2, 
    Fuel, 
    Paintbrush, 
    Dna,
    MessageCircle,
    Copy,
    Share2
} from 'lucide-react';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    description: string | null;
    featured_image: string | null;
    transmission: string | null;
    mileage: number | null;
    fuel_type: string | null;
    engine: string | null;
    exterior_color: string | null;
    interior_color: string | null;
    images: string[] | null;
    description_ja: string | null;
    transmission_ja: string | null;
    fuel_type_ja: string | null;
    exterior_color_ja: string | null;
}

export default async function CarDetailsPage({ 
    params 
}: { 
    params: Promise<{ id: string; locale: string }> 
}) {
    const { id, locale } = await params;
    const supabase = await createClient();

    const { data: carData, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !carData) {
        notFound();
    }

    const car = carData as Car;

    const messages = await getMessages();

    // Format price (assuming yen)
    const formattedPrice = new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : locale === 'en' ? 'en-US' : 'pt-BR', {
        style: 'currency',
        currency: 'JPY',
    }).format(car.price);

    const allImages = [car.featured_image, ...(car.images || [])].filter((img): img is string => !!img);

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <div className="min-h-screen bg-black text-white pt-24 pb-20">
                <div className="container mx-auto px-4">
                    {/* Breadcrumbs / Back Button */}
                    <Link 
                        href="/inventory" 
                        className="inline-flex items-center gap-2 text-text-dim hover:text-brand-red transition-colors mb-8 group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>{locale === 'ja' ? '在庫一覧に戻る' : locale === 'en' ? 'Back to inventory' : 'Voltar para o estoque'}</span>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left Column: Image Gallery */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            <div className="relative aspect-[16/10] bg-surface-dark rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                                <Image
                                    src={car.featured_image || ''}
                                    alt={`${car.brand} ${car.model}`}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            </div>

                            {/* Thumbnail Grid */}
                            {allImages.length > 1 && (
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                                    {allImages.map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            className="relative aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-brand-red cursor-pointer transition-colors"
                                        >
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${idx}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Description Section */}
                            <div className="mt-8 bg-surface-card/30 rounded-2xl p-8 border border-white/5">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-1 h-6 bg-brand-red rounded-full" />
                                    {locale === 'ja' ? '車両詳細説明' : locale === 'en' ? 'Vehicle Description' : 'Descrição do Veículo'}
                                </h2>
                                <div className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                                    {(locale === 'ja' && car.description_ja) || car.description || (locale === 'ja' ? '詳細説明はありません。' : locale === 'en' ? 'No detailed description available.' : 'Nenhuma descrição detalhada disponível.')}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Info & Actions */}
                        <div className="lg:col-span-5 flex flex-col gap-8">
                            <div className="sticky top-28 space-y-8">
                                {/* Title & Price */}
                                <div className="bg-surface-card rounded-2xl p-8 border border-white/10 shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-red/10 transition-colors" />
                                    
                                    <div className="relative z-10">
                                        <div className="text-brand-red font-semibold uppercase tracking-widest text-sm mb-2">
                                            {car.year} {car.brand}
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                                            {car.model}
                                        </h1>
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {formattedPrice}
                                        </div>
                                        <p className="text-text-dim text-sm italic">
                                            {locale === 'ja' ? '* 価格は交渉や諸費用により変動する場合があります。' : locale === 'en' ? '* Price subject to negotiation and local fees.' : '* Preço sujeito a negociação e taxas locais.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Technical Specs Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <SpecItem 
                                        icon={<Calendar className="w-5 h-5 text-brand-red" />} 
                                        label={locale === 'ja' ? '年式' : locale === 'en' ? 'Year' : 'Ano'} 
                                        value={car.year.toString()} 
                                    />
                                    <SpecItem 
                                        icon={<Gauge className="w-5 h-5 text-brand-red" />} 
                                        label={locale === 'ja' ? '走行距離' : locale === 'en' ? 'Mileage' : 'Quilometragem'} 
                                        value={car.mileage ? `${car.mileage.toLocaleString()} km` : '---'} 
                                    />
                                    <SpecItem 
                                        icon={<Settings2 className="w-5 h-5 text-brand-red" />} 
                                        label={locale === 'ja' ? 'ミッション' : locale === 'en' ? 'Transmission' : 'Câmbio'} 
                                        value={(locale === 'ja' && car.transmission_ja) || car.transmission || 'Manual'} 
                                    />
                                    <SpecItem 
                                        icon={<Fuel className="w-5 h-5 text-brand-red" />} 
                                        label={locale === 'ja' ? 'エンジン' : locale === 'en' ? 'Engine' : 'Motor'} 
                                        value={car.engine || '---'} 
                                    />
                                    <SpecItem 
                                        icon={<Fuel className="w-5 h-5 text-brand-red" />} 
                                        label={locale === 'ja' ? '燃料' : locale === 'en' ? 'Fuel' : 'Combustível'} 
                                        value={(locale === 'ja' && car.fuel_type_ja) || car.fuel_type || (locale === 'ja' ? 'ガソリン' : 'Gasolina')} 
                                    />
                                    <SpecItem 
                                        icon={<Paintbrush className="w-5 h-5 text-brand-red" />} 
                                        label={locale === 'ja' ? '外装色' : locale === 'en' ? 'Color' : 'Cor Exterior'} 
                                        value={(locale === 'ja' && car.exterior_color_ja) || car.exterior_color || '---'} 
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-4">
                                    <a 
                                        href={`https://wa.me/818042461111?text=${locale === 'ja' ? `こんにちは、${car.brand} ${car.model} (${car.year})に興味があります。` : `Olá, tenho interesse no ${car.brand} ${car.model} (${car.year})`}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                                    >
                                        <MessageCircle className="w-6 h-6" />
                                        <span>{locale === 'ja' ? 'WhatsAppで問い合わせる' : locale === 'en' ? 'Inquiry via WhatsApp' : 'Tenho Interesse via WhatsApp'}</span>
                                    </a>
                                    
                                    <Link 
                                        href="/contact"
                                        className="flex items-center justify-center gap-3 bg-white hover:bg-brand-red text-black hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 border border-white/10 shadow-lg"
                                    >
                                        {locale === 'ja' ? 'お見積り依頼' : locale === 'en' ? 'Request a Quote' : 'Orçamento Formal'}
                                    </Link>
                                </div>

                                {/* Trust Badges */}
                                <div className="flex justify-between items-center py-6 border-t border-b border-white/5">
                                    <TrustItem icon={<Dna className="w-4 h-4" />} text="Procedência JDM" />
                                    <TrustItem icon={<Share2 className="w-4 h-4" />} text="Compartilhar" />
                                    <TrustItem icon={<Copy className="w-4 h-4" />} text="ID: #1234" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NextIntlClientProvider>
    );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-surface-card/50 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 text-text-dim text-xs uppercase tracking-widest mb-1">
                {icon}
                {label}
            </div>
            <div className="text-lg font-semibold text-white truncate">
                {value}
            </div>
        </div>
    );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-2 text-text-dim text-[10px] uppercase tracking-tighter hover:text-white transition-colors cursor-pointer">
            {icon}
            <span>{text}</span>
        </div>
    );
}
