import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';

type Car = Database['public']['Tables']['cars']['Row'];
type CarInsert = Database['public']['Tables']['cars']['Insert'];
type CarUpdate = Database['public']['Tables']['cars']['Update'];

export const carService = {
    async getAllCars() {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    },

    async getAvailableCars() {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('status', 'available')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    },

    async getCarById(id: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    async createCar(car: CarInsert) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('cars')
            .insert(car)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    async updateCar(id: string, updates: CarUpdate) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('cars')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    },
};
