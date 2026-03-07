import { useTranslations } from 'next-intl';
import { InventorySection } from '@/components/InventorySection';
import { ServicesSection } from '@/components/ServicesSection';
import { ContactSection } from '@/components/ContactSection';

export default function Home() {
    const t = useTranslations('Hero');
    return (
        <>
            <div className="flex min-h-[90vh] items-center justify-center bg-black relative border-b border-surface-card overflow-hidden">
                <main className="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center text-center mt-[-5vh]">
                    <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-lg scale-105 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                            {t('title1')}
                            <br />
                            <span className="text-brand-red">{t('title2')}</span>
                        </h1>
                    </div>
                </main>
            </div>

            <InventorySection />
            <ServicesSection />
            <ContactSection />
        </>
    );
}
