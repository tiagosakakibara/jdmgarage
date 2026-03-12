import { useTranslations } from 'next-intl';
import { InventorySection } from '@/components/InventorySection';
import { ServicesSection } from '@/components/ServicesSection';
import { ContactSection } from '@/components/ContactSection';
import { HeroSimple } from '@/components/HeroSimple';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: dbSlides } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    const heroSlides = dbSlides && dbSlides.length > 0 ? dbSlides.map(slide => ({
        image: slide.image,
        subtitle: slide.subtitle,
        subtitle_ja: slide.subtitle_ja,
        title1: slide.title1,
        title1_ja: slide.title1_ja,
        title2: slide.title2 || undefined,
        title2_ja: slide.title2_ja || undefined,
        description: slide.description,
        description_ja: slide.description_ja,
        primaryBtn: slide.primary_btn,
        primaryBtn_ja: slide.primary_btn_ja,
        primaryLink: slide.primary_link || undefined,
        secondaryBtn: slide.secondary_btn || undefined,
        secondaryBtn_ja: slide.secondary_btn_ja,
        secondaryLink: slide.secondary_link || undefined,
        showText: slide.show_text,
    })) : undefined;

    return (
        <>
            <HeroSimple slides={heroSlides} locale={locale} />
            <InventorySection />
            <ServicesSection />
            <ContactSection />
        </>
    );
}
