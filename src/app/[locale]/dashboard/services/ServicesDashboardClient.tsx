"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';

type ServiceRow = Database['public']['Tables']['services']['Row'];
type ServiceInsert = Database['public']['Tables']['services']['Insert'];

export default function ServicesDashboardClient() {
    const [services, setServices] = useState<ServiceRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    // Form inputs
    const [carInfo, setCarInfo] = useState('');
    const [serviceNotes, setServiceNotes] = useState('');
    const [cost, setCost] = useState('');
    const [completedDate, setCompletedDate] = useState('');

    const fetchServices = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        if (data && !error) setServices(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newService: ServiceInsert = {
            car_info: carInfo,
            service_notes: serviceNotes,
            cost: parseFloat(cost) || 0,
            completed_at: completedDate ? new Date(completedDate).toISOString() : null,
        };

        const { error } = await supabase.from('services').insert(newService);

        if (error) {
            alert('Erro ao registrar serviço: ' + error.message);
        } else {
            alert('Serviço registrado com sucesso!');
            // clear form
            setCarInfo('');
            setServiceNotes('');
            setCost('');
            setCompletedDate('');
            // refresh
            fetchServices();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este registro?')) return;
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) {
            alert('Erro ao remover: ' + error.message);
        } else {
            fetchServices();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1 bg-surface-card border border-white/5 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Registrar Novo Serviço</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Veículo (Info)</label>
                        <input
                            type="text" required value={carInfo} onChange={e => setCarInfo(e.target.value)}
                            placeholder="Ex: Nissan Skyline R34"
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Custo (¥)</label>
                        <input
                            type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Data Conclusão</label>
                        <input
                            type="date" value={completedDate} onChange={e => setCompletedDate(e.target.value)}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Observações do Serviço</label>
                        <textarea
                            rows={4} value={serviceNotes} onChange={e => setServiceNotes(e.target.value)}
                            required
                            placeholder="Ex: Troca de óleo, alinhamento, reparo no chassi..."
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-red hover:bg-rose-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar Registro'}
                    </button>
                </form>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2 bg-surface-card border border-white/5 p-6 rounded-2xl flex flex-col h-[800px]">
                <h2 className="text-xl font-bold text-white mb-6">Histórico de Serviços</h2>

                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-red"></div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {services.map(svc => (
                            <div key={svc.id} className="bg-surface-dark border border-white/5 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex-1 mr-4">
                                    <h3 className="font-bold text-brand-red">{svc.car_info || 'Veículo não informado'}</h3>
                                    <p className="text-white text-sm mt-1">{svc.service_notes}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-text-dim">
                                        <span>Custo: ¥ {svc.cost?.toString() || '0'}</span>
                                        <span>Conc.: {svc.completed_at ? new Date(svc.completed_at).toLocaleDateString() : 'Pendente'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(svc.id)}
                                    className="text-red-500 hover:text-red-400 text-sm border border-red-500/20 hover:border-red-500/50 px-3 py-1 rounded transition-colors self-start"
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                        {services.length === 0 && (
                            <p className="text-text-dim text-center py-10">Nenhum serviço registrado.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
