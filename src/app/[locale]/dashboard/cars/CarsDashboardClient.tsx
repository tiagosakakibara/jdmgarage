"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';

type Car = Database['public']['Tables']['cars']['Row'];
type CarInsert = Database['public']['Tables']['cars']['Insert'];

export default function CarsDashboardClient() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    // Form inputs
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [status, setStatus] = useState('available');

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fetchCars = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
        if (data && !error) setCars(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCars();
    }, []);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let finalImageUrl = featuredImage;

        if (file) {
            try {
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('cars')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error('Erro de upload:', uploadError);
                    alert('Erro ao fazer upload: ' + uploadError.message);
                    setIsSubmitting(false);
                    return;
                }

                const { data } = supabase.storage
                    .from('cars')
                    .getPublicUrl(fileName);

                if (data?.publicUrl) {
                    finalImageUrl = data.publicUrl;
                } else {
                    console.error('Não foi possível obter a URL pública');
                }
            } catch (err: any) {
                console.error('Exceção no upload:', err);
                alert('Erro inesperado no upload: ' + err.message);
                setIsSubmitting(false);
                return;
            }
        }

        const newCar: CarInsert = {
            brand,
            model,
            year: parseInt(year),
            price: parseFloat(price),
            description,
            featured_image: finalImageUrl || null,
            status,
        };

        const { error } = await supabase.from('cars').insert(newCar);

        if (error) {
            alert('Erro ao adicionar carro: ' + error.message);
        } else {
            alert('Carro adicionado com sucesso!');
            // clear form
            setBrand('');
            setModel('');
            setYear('');
            setPrice('');
            setDescription('');
            setFeaturedImage('');
            setFile(null);
            // refresh
            fetchCars();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este carro?')) return;

        // Recuperar a imagem para deletar do Storage
        const carToDelete = cars.find(c => c.id === id);

        if (carToDelete?.featured_image && carToDelete.featured_image.includes('supabase.co')) {
            try {
                // Extrai apenas o nome do arquivo no final da URL
                const urlParts = carToDelete.featured_image.split('/');
                const fileName = urlParts[urlParts.length - 1];

                if (fileName) {
                    await supabase.storage.from('cars').remove([fileName]);
                }
            } catch (err) {
                console.error('Erro ao deletar imagem do storage:', err);
            }
        }

        const { error } = await supabase.from('cars').delete().eq('id', id);
        if (error) {
            alert('Erro ao remover: ' + error.message);
        } else {
            fetchCars();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1 bg-surface-card border border-white/5 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Cadastrar Novo Carro</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Marca</label>
                        <input
                            type="text" required value={brand} onChange={e => setBrand(e.target.value)}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Modelo</label>
                        <input
                            type="text" required value={model} onChange={e => setModel(e.target.value)}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Ano</label>
                            <input
                                type="number" required value={year} onChange={e => setYear(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Preço (¥)</label>
                            <input
                                type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Status</label>
                        <select
                            value={status} onChange={e => setStatus(e.target.value)}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        >
                            <option value="available">Disponível</option>
                            <option value="sold">Vendido</option>
                            <option value="reserved">Reservado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Upload da Imagem</label>
                        <input
                            type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-red file:text-white hover:file:bg-rose-700"
                        />
                        
                        {previewUrl && (
                            <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden border border-white/10">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        )}

                        <p className="text-xs text-text-dim mt-2">Ou digite uma URL direta abaixo:</p>
                        <input
                            type="text" value={featuredImage} onChange={e => setFeaturedImage(e.target.value)}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red mt-1"
                            placeholder="/images/cars/foto.jpg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Descrição</label>
                        <textarea
                            rows={3} value={description} onChange={e => setDescription(e.target.value)}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-red hover:bg-rose-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Salvando...' : 'Adicionar Veículo'}
                    </button>
                </form>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2 bg-surface-card border border-white/5 p-6 rounded-2xl flex flex-col h-[800px]">
                <h2 className="text-xl font-bold text-white mb-6">Veículos Cadastrados</h2>

                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-red"></div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {cars.map(car => (
                            <div key={car.id} className="bg-surface-dark border border-white/5 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-12 bg-black rounded overflow-hidden relative">
                                        {car.featured_image && (
                                            <img src={car.featured_image} alt={car.model} className="object-cover w-full h-full" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{car.brand} {car.model} ({car.year})</h3>
                                        <p className="text-sm text-text-dim">Status: {car.status} | ¥ {car.price}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(car.id)}
                                    className="text-red-500 hover:text-red-400 text-sm border border-red-500/20 hover:border-red-500/50 px-3 py-1 rounded transition-colors"
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                        {cars.length === 0 && (
                            <p className="text-text-dim text-center py-10">Nenhum veículo encontrado.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
