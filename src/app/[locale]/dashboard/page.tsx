import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch counts
    const { count: carsCount } = await supabase.from('cars').select('*', { count: 'exact', head: true });
    const { count: servicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true });
    const { count: appointmentsCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true });

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-card border border-white/5 p-6 rounded-xl">
                    <h3 className="text-text-dim text-sm font-medium mb-2">Total de Carros</h3>
                    <p className="text-4xl font-bold text-white">{carsCount || 0}</p>
                </div>
                <div className="bg-surface-card border border-white/5 p-6 rounded-xl">
                    <h3 className="text-text-dim text-sm font-medium mb-2">Total de Serviços Registrados</h3>
                    <p className="text-4xl font-bold text-white">{servicesCount || 0}</p>
                </div>
                <div className="bg-surface-card border border-white/5 p-6 rounded-xl">
                    <h3 className="text-text-dim text-sm font-medium mb-2">Agendamentos Pendentes</h3>
                    <p className="text-4xl font-bold text-white">{appointmentsCount || 0}</p>
                </div>
            </div>
        </div>
    );
}
