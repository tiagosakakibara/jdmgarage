"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const toggleLocale = () => {
        const nextLocale = locale === 'pt' ? 'ja' : 'pt';
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <button
            onClick={toggleLocale}
            disabled={isPending}
            className="flex items-center gap-2 text-text-dim hover:text-white transition-colors p-2 text-sm font-medium"
            title="Mudar Idioma / 言語を変更"
        >
            <Globe size={18} />
            <span>{locale === 'pt' ? '日本語' : 'PT'}</span>
        </button>
    );
}
