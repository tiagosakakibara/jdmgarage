import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return response
    }

    let supabaseResponse = response

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    
                    // Only create a fresh NextResponse.next if we aren't already returning a redirect
                    // This is crucial for next-intl compatibility
                    if (supabaseResponse.headers.get('location')) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    } else {
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    }
                },
            },
        }
    )

    // IMPORTANT: Avoid calling getUser() if we are already redirecting
    if (supabaseResponse.headers.get('location')) {
        return supabaseResponse
    }

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        const pathname = request.nextUrl.pathname;
        const isDashboardPath = pathname.match(/^\/(pt|ja|en)\/dashboard/);
        const isLoginPath = pathname.match(/^\/(pt|ja|en)\/login/);
        const localeMatch = pathname.match(/^\/(pt|ja|en)/);
        const locale = localeMatch ? localeMatch[1] : 'pt';

        if (!user && isDashboardPath) {
            const url = request.nextUrl.clone()
            url.pathname = `/${locale}/login`
            return NextResponse.redirect(url)
        }

        if (user && isLoginPath) {
            const url = request.nextUrl.clone()
            url.pathname = `/${locale}/dashboard`
            return NextResponse.redirect(url)
        }
    } catch (e) {
        // If Supabase fails, we still return the original response to avoid crashing the whole site
        console.error('Middleware Supabase error:', e)
    }

    return supabaseResponse
}
