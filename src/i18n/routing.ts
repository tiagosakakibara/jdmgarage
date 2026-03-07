import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['pt', 'ja', 'en'], // Added en optionally, but sticking to pt, ja primarily. Let's stick to pt, ja as requested.
  defaultLocale: 'pt',
  localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
