"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';
import { Image as ImageIcon, Upload, Save, CheckCircle2 } from 'lucide-react';

type ServiceContent = Database['public']['Tables']['service_content']['Row'];

export default function ServiceContentDashboard() {
    const [contents, setContents] = useState<ServiceContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const supabase = createClient();

    const fetchContent = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('service_content')
            .select('*')
            .order('section_key', { ascending: true });
        
        if (data && !error) {
            setContents(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleFileUpload = async (sectionKey: string, file: File) => {
        setUploading(sectionKey);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `services/${sectionKey}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('cars') // Reusing 'cars' bucket since it's already set up
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('cars')
                .getPublicUrl(fileName);

            const { error: updateError } = await supabase
                .from('service_content')
                .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
                .eq('section_key', sectionKey);

            if (updateError) throw updateError;

            await fetchContent();
            alert('Imagem atualizada com sucesso!');
        } catch (error: any) {
            console.error('Error uploading:', error);
            alert('Erro ao fazer upload: ' + error.message);
        } finally {
            setUploading(null);
        }
    };

    const handleUrlUpdate = async (sectionKey: string, url: string) => {
        try {
            const { error } = await supabase
                .from('service_content')
                .update({ image_url: url, updated_at: new Date().toISOString() })
                .eq('section_key', sectionKey);

            if (error) throw error;
            
            await fetchContent();
            alert('URL atualizada!');
        } catch (error: any) {
            alert('Erro: ' + error.message);
        }
    };

    const getSectionLabel = (key: string) => {
        switch (key) {
            case 'hero': return 'Banner Principal (Topo)';
            case 'shaken': return 'Inspeção Shaken';
            case 'maintenance': return 'Manutenção & Reparos';
            case 'customization': return 'Personalização & Performance';
            default: return key;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-red"></div>
            </div>
        );
    }

    return (
        <div className="bg-surface-card border border-white/5 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-8">
                <ImageIcon className="text-brand-redw-6 h-6" />
                <h2 className="text-xl font-bold text-white">Imagens da Página de Serviços</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {contents.map((item) => (
                    <div key={item.id} className="bg-surface-dark border border-white/5 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-white">{getSectionLabel(item.section_key)}</h3>
                            <span className="text-[10px] text-text-dim uppercase tracking-wider">CHAVE: {item.section_key}</span>
                        </div>

                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/5">
                            <img 
                                src={item.image_url} 
                                alt={item.section_key} 
                                className="w-full h-full object-cover"
                            />
                            {uploading === item.section_key && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-brand-red"></div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-text-dim mb-1">Mudar Imagem (Upload)</label>
                                <div className="flex items-center gap-2">
                                    <label className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white transition-colors flex items-center justify-center gap-2">
                                        <Upload size={14} />
                                        <span>Selecionar Arquivo</span>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileUpload(item.section_key, file);
                                            }}
                                            disabled={!!uploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-text-dim mb-1">Ou URL direta</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        defaultValue={item.image_url}
                                        onBlur={(e) => {
                                            if (e.target.value !== item.image_url) {
                                                handleUrlUpdate(item.section_key, e.target.value);
                                            }
                                        }}
                                        className="flex-1 bg-surface-card border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-brand-red"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-text-dim pt-2">
                            <CheckCircle2 size={10} className="text-green-500" />
                            <span>Última atualização: {new Date(item.updated_at).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
