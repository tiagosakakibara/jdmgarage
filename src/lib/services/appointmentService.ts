import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];

export const appointmentService = {
    async getMyAppointments() {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('appointments')
            .select('*, services(*)')
            .eq('profile_id', user.id)
            .order('preferred_date', { ascending: true });

        if (error) throw new Error(error.message);
        return data;
    },

    async createAppointment(appointment: AppointmentInsert) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('appointments')
            .insert({ ...appointment, profile_id: user.id })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
};
