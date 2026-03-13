"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Clock, MessageCircle, Phone } from 'lucide-react';

export function ContactSection() {
    const t = useTranslations('Contact');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // JDM GARAGE Phone Number
        const phoneNumber = "819017265361";

        let text = `*Novo Contato - Site JDM GARAGE*\n\n`;
        if (name) text += `*Nome:* ${name}\n`;
        if (phone) text += `*Telefone:* ${phone}\n\n`;
        if (message) text += `*Mensagem:*\n${message}`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

        window.open(whatsappUrl, '_blank');
    };

    return (
        <section className="py-12 md:py-24 bg-surface-dark relative" id="contact">
            {/* Visual divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* Left Column: Find Us & Map */}
                    <div>
                        <div className="bg-surface-card border border-white/5 rounded-2xl p-6 md:p-8 h-full flex flex-col shadow-xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
                                {t('findUs')} <span className="text-brand-red">{t('us')}</span>
                            </h2>

                            <div className="space-y-6 mb-8 flex-1">
                                <div className="flex items-start gap-4">
                                    <div className="text-brand-red mt-1">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium mb-1">JDM GARAGE</h4>
                                        <p className="text-text-dim max-w-xs">{t('address')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="text-brand-red mt-1">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium mb-1">{t('hours')}</h4>
                                        <p className="text-brand-red text-sm font-semibold mt-1">{t('sundayClosed')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="text-brand-red mt-1">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium mb-1">{t('phone')}</h4>
                                        <a href="tel:09017265361" className="text-text-dim hover:text-brand-red transition-colors">090-1726-5361</a>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="https://maps.google.com/?q=Yokohama,Japan"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-4 rounded bg-brand-red text-white font-medium flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors"
                            >
                                <MapPin size={20} />
                                {t('openMaps')}
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div>
                        <div className="text-center md:text-left mb-8 md:mb-10 lg:pt-0 pt-10 border-t md:border-t-0 border-white/5 md:pt-0 mt-4 md:mt-0">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {t('getInTouch')} <span className="text-brand-red">{t('today')}</span>
                            </h2>
                            <p className="text-text-dim text-base md:text-lg">
                                {t('contactSub')}
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleWhatsAppSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t('fullName')}
                                        className="w-full bg-surface-card border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-brand-red transition-colors placeholder:text-text-dim/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={t('phone')}
                                        className="w-full bg-surface-card border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-brand-red transition-colors placeholder:text-text-dim/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t('message')}
                                    rows={5}
                                    className="w-full bg-surface-card border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-brand-red transition-colors placeholder:text-text-dim/50 resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded bg-[#25D366] text-white font-bold text-lg hover:bg-[#128C7E] transition-colors mt-4 flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={24} />
                                {t('send')} via WhatsApp
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
