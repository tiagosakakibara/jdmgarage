import { useTranslations } from 'next-intl';
import { InventorySection } from '@/components/InventorySection';
import { ServicesSection } from '@/components/ServicesSection';
import { ContactSection } from '@/components/ContactSection';
import { HeroSlider } from '@/components/HeroSlider';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const supabase = await createClient();

    const { data: dbSlides } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    const heroSlides = dbSlides && dbSlides.length > 0 ? dbSlides.map(slide => ({
        image: slide.image,
        subtitle: slide.subtitle,
        title1: slide.title1,
        title2: slide.title2 || undefined,
        description: slide.description,
        primaryBtn: slide.primary_btn,
        primaryLink: slide.primary_link || undefined,
        secondaryBtn: slide.secondary_btn || undefined,
        secondaryLink: slide.secondary_link || undefined,
        showText: slide.show_text,
    })) : undefined;

    return (
        <>
            <HeroSlider slides={heroSlides} />
            <InventorySection />
            <ServicesSection />
            <ContactSection />
        </>
    );
}
