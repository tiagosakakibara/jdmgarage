import { useTranslations } from 'next-intl';
import { InventorySection } from '@/components/InventorySection';
import { ServicesSection } from '@/components/ServicesSection';
import { ContactSection } from '@/components/ContactSection';
import { HeroSlider } from '@/components/HeroSlider';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const isJa = locale === 'ja';
    let dbSlides = null;
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('hero_slides')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        dbSlides = data;
    } catch (error) {
        console.error('Error fetching hero slides:', error);
    }

    const heroSlides = dbSlides && dbSlides.length > 0 ? dbSlides.map(slide => ({
        image: slide.image,
        subtitle: (isJa && slide.subtitle_ja) || slide.subtitle,
        title1: (isJa && slide.title1_ja) || slide.title1,
        title2: (isJa && slide.title2_ja) || slide.title2 || undefined,
        description: (isJa && slide.description_ja) || slide.description,
        showText: slide.show_text,
        primaryBtn: '', 
    })) : undefined;

    return (
        <>
            <HeroSlider slides={heroSlides} locale={locale} />
            <InventorySection />
            <ServicesSection />
            <ContactSection />
        </>
    );
}
