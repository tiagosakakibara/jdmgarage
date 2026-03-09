"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';

type HeroSlide = Database['public']['Tables']['hero_slides']['Row'];
type HeroSlideInsert = Database['public']['Tables']['hero_slides']['Insert'];

export default function HeroDashboardClient() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const supabase = createClient();

    // Form inputs
    const [subtitle, setSubtitle] = useState('');
    const [title1, setTitle1] = useState('');
    const [title2, setTitle2] = useState('');
    const [description, setDescription] = useState('');
    const [primaryBtn, setPrimaryBtn] = useState('Ver Estoque');
    const [primaryLink, setPrimaryLink] = useState('/inventory');
    const [secondaryBtn, setSecondaryBtn] = useState('');
    const [secondaryLink, setSecondaryLink] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [displayOrder, setDisplayOrder] = useState('0');
    const [isActive, setIsActive] = useState(true);
    const [showText, setShowText] = useState(true);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fetchSlides = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('hero_slides').select('*').order('display_order', { ascending: true });
        if (data && !error) setSlides(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchSlides();
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
                const fileName = `hero-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

                // Usando o bucket cars para não precisar criar/configurar um novo no console agora
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

        const newSlide: HeroSlideInsert = {
            subtitle,
            title1,
            title2,
            description,
            primary_btn: primaryBtn,
            primary_link: primaryLink,
            secondary_btn: secondaryBtn || null,
            secondary_link: secondaryLink || null,
            image: finalImageUrl,
            display_order: parseInt(displayOrder) || 0,
            is_active: isActive,
            show_text: showText
        };

        if (editingId) {
            const { error } = await supabase.from('hero_slides').update(newSlide).eq('id', editingId);
            if (error) {
                alert('Erro ao atualizar slide: ' + error.message);
            } else {
                alert('Slide atualizado com sucesso!');
                resetForm();
                fetchSlides();
            }
        } else {
            const { error } = await supabase.from('hero_slides').insert(newSlide);
            if (error) {
                alert('Erro ao adicionar slide: ' + error.message);
            } else {
                alert('Slide adicionado com sucesso!');
                resetForm();
                fetchSlides();
            }
        }
        setIsSubmitting(false);
    };

    const resetForm = () => {
        setEditingId(null);
        setSubtitle('');
        setTitle1('');
        setTitle2('');
        setDescription('');
        setFeaturedImage('');
        setPrimaryBtn('Ver Estoque');
        setPrimaryLink('/inventory');
        setSecondaryBtn('');
        setSecondaryLink('');
        setDisplayOrder('0');
        setIsActive(true);
        setShowText(true);
        setFile(null);
    };

    const handleEdit = (slide: HeroSlide) => {
        setEditingId(slide.id);
        setSubtitle(slide.subtitle);
        setTitle1(slide.title1);
        setTitle2(slide.title2 || '');
        setDescription(slide.description);
        setPrimaryBtn(slide.primary_btn);
        setPrimaryLink(slide.primary_link || '');
        setSecondaryBtn(slide.secondary_btn || '');
        setSecondaryLink(slide.secondary_link || '');
        setFeaturedImage(slide.image);
        setDisplayOrder(slide.display_order.toString());
        setIsActive(slide.is_active);
        setShowText(slide.show_text);
        setFile(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este slide?')) return;

        const slideToDelete = slides.find(s => s.id === id);

        if (slideToDelete?.image && slideToDelete.image.includes('supabase.co')) {
            try {
                const urlParts = slideToDelete.image.split('/');
                const fileName = urlParts[urlParts.length - 1];
                if (fileName) {
                    await supabase.storage.from('cars').remove([fileName]);
                }
            } catch (err) {
                console.error('Erro ao deletar imagem do storage:', err);
            }
        }

        const { error } = await supabase.from('hero_slides').delete().eq('id', id);
        if (error) {
            alert('Erro ao remover: ' + error.message);
        } else {
            fetchSlides();
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase.from('hero_slides').update({ is_active: !currentStatus }).eq('id', id);
        if (error) {
            alert('Erro ao alterar status: ' + error.message);
        } else {
            fetchSlides();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1 bg-surface-card border border-white/5 p-6 rounded-2xl max-h-[900px] overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-6">
                    {editingId ? 'Editar Slide' : 'Criar Novo Slide'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Subtítulo (Vermelho)</label>
                        <input
                            type="text" required value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Ex: American Muscle"
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Título Principal (Linha 1)</label>
                        <input
                            type="text" required value={title1} onChange={e => setTitle1(e.target.value)} placeholder="Ex: Precision Engineering."
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Título Principal (Linha 2 opcional)</label>
                        <input
                            type="text" value={title2} onChange={e => setTitle2(e.target.value)} placeholder="Ex: Timeless Design."
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Descrição</label>
                        <textarea
                            rows={3} required value={description} onChange={e => setDescription(e.target.value)}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Botão Principal</label>
                            <input
                                type="text" required value={primaryBtn} onChange={e => setPrimaryBtn(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Link Botão 1</label>
                            <input
                                type="text" value={primaryLink} onChange={e => setPrimaryLink(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Botão Secundário</label>
                            <input
                                type="text" value={secondaryBtn} onChange={e => setSecondaryBtn(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Link Botão 2</label>
                            <input
                                type="text" value={secondaryLink} onChange={e => setSecondaryLink(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Ordem (Nav)</label>
                            <input
                                type="number" required value={displayOrder} onChange={e => setDisplayOrder(e.target.value)}
                                className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red"
                            />
                        </div>
                        <div className="flex items-center gap-4 mt-6">
                            <label className="flex items-center gap-2 text-sm font-medium text-white cursor-pointer">
                                <input
                                    type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)}
                                    className="accent-brand-red w-4 h-4"
                                />
                                Slide Ativo
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium text-white cursor-pointer">
                                <input
                                    type="checkbox" checked={showText} onChange={e => setShowText(e.target.checked)}
                                    className="accent-brand-red w-4 h-4"
                                />
                                Exibir Textos
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Upload da Imagem Background</label>
                        <input
                            type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required={!featuredImage && !file}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-red file:text-white hover:file:bg-rose-700"
                        />

                        {previewUrl && (
                            <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-white/10">
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
                        <p className="text-xs text-text-dim mt-2">Ou digite uma URL direta:</p>
                        <input
                            type="text" value={featuredImage} onChange={e => setFeaturedImage(e.target.value)}
                            className="w-full bg-surface-dark border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-red mt-1"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-red hover:bg-rose-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar Slide' : 'Adicionar Slide'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isSubmitting}
                                className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancelar Edição
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2 bg-surface-card border border-white/5 p-6 rounded-2xl flex flex-col h-[800px]">
                <h2 className="text-xl font-bold text-white mb-6">Slides Cadastrados</h2>

                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-red"></div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {slides.map(slide => (
                            <div key={slide.id} className={`bg-surface-dark border border-white/5 p-4 rounded-xl flex items-center justify-between ${!slide.is_active && 'opacity-50'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-16 bg-black rounded overflow-hidden relative">
                                        <img src={slide.image} alt={slide.title1} className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{slide.title1} {slide.title2}</h3>
                                        <p className="text-sm text-text-dim">Ordem: {slide.display_order} | {slide.subtitle}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(slide)}
                                        className="text-sm border border-blue-500 text-blue-500 hover:bg-blue-500/10 px-3 py-1 rounded transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(slide.id, slide.is_active)}
                                        className={`text-sm border px-3 py-1 rounded transition-colors ${slide.is_active ? 'border-brand-red text-brand-red hover:bg-brand-red/10' : 'border-gray-500 text-gray-500 hover:bg-gray-500/10'}`}
                                    >
                                        {slide.is_active ? 'Inativar' : 'Ativar'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slide.id)}
                                        className="text-red-500 hover:text-red-400 text-sm border border-red-500/20 hover:border-red-500/50 px-3 py-1 rounded transition-colors"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                        {slides.length === 0 && (
                            <p className="text-text-dim text-center py-10">Nenhum slide encontrado.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
