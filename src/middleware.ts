import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    // Generate the internationalization response
    const intlResponse = intlMiddleware(request);

    // Update the Supabase session, passing the Next-Intl response to merge cookies
    const supabaseResponse = await updateSession(request, intlResponse);

    return supabaseResponse;
}

export const config = {
    // Match only internationalized pathnames
    // Add other matcher patterns as needed for images, api, etc.
    matcher: ['/', '/(pt|ja)/:path*', '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
