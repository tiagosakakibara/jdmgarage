'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import { getLocale } from 'next-intl/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: (formData.get('email') as string).trim(),
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error('Login error:', error)
        const locale = await getLocale()
        redirect(`/${locale}/login?error=${encodeURIComponent(error.message)}`)
    }

    const locale = await getLocale()
    revalidatePath('/', 'layout')
    redirect(`/${locale}/dashboard`)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.error('Signup error:', error)
        const locale = await getLocale()
        redirect(`/${locale}/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
        console.error('Logout error:', error)
    }
    
    const locale = await getLocale()
    revalidatePath('/', 'layout')
    redirect(`/${locale}/login`)
}
