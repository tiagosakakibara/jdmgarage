"use client";

import { useTranslations } from 'next-intl';
import { MapPin, Clock } from 'lucide-react';

export function ContactSection() {
    const t = useTranslations('Contact');

    return (
        <section className="py-24 bg-surface-dark relative" id="contact">
            {/* Visual divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Left Column: Find Us & Map */}
                    <div>
                        <div className="bg-surface-card border border-white/5 rounded-2xl p-8 h-full flex flex-col">
                            <h2 className="text-3xl font-bold text-white mb-8">
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
                            </div>

                            {/* Map Placeholder for now (could embed a real iframe) */}
                            <div className="w-full h-64 bg-surface-dark border border-white/10 rounded-xl mb-6 relative overflow-hidden group">
                                {/* A stylized placeholder representing a map */}
                                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Yokohama,Japan&zoom=12&size=600x300&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0xffffff&style=feature:all|element:labels.text.stroke|color:0x000000&style=feature:all|element:labels.icon|visibility:off&style=feature:administrative|element:geometry.fill|color:0x000000&style=feature:administrative|element:geometry.stroke|color:0x144b53&style=feature:landscape|element:geometry|color:0x080808&style=feature:poi|element:geometry|color:0x0c0c0c&style=feature:road.highway|element:geometry.fill|color:0x000000&style=feature:road.highway|element:geometry.stroke|color:0x0b434f&style=feature:road.arterial|element:geometry.fill|color:0x000000&style=feature:road.arterial|element:geometry.stroke|color:0x0b3d51&style=feature:road.local|element:geometry.fill|color:0x000000&style=feature:road.local|element:geometry.stroke|color:0x144b53&style=feature:transit|element:geometry.fill|color:0x146474&style=feature:transit.line|element:geometry.fill|color:0x1b1b1b&style=feature:water|element:geometry.fill|color:0x0b3446')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity grayscale" />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center animate-ping absolute" />
                                    <div className="w-4 h-4 rounded-full bg-brand-red relative z-10" />
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
                        <div className="text-center md:text-left mb-10">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                {t('getInTouch')} <span className="text-brand-red">{t('today')}</span>
                            </h2>
                            <p className="text-text-dim text-lg">
                                {t('contactSub')}
                            </p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t('fullName')}
                                        className="w-full bg-surface-card border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-brand-red transition-colors placeholder:text-text-dim/50"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder={t('email')}
                                        className="w-full bg-surface-card border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-brand-red transition-colors placeholder:text-text-dim/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <textarea
                                    placeholder={t('message')}
                                    rows={5}
                                    className="w-full bg-surface-card border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-brand-red transition-colors placeholder:text-text-dim/50 resize-none"
                                />
                            </div>

                            <button
                                type="button"
                                className="w-full py-4 rounded bg-brand-red text-white font-bold text-lg hover:bg-rose-700 transition-colors mt-4"
                            >
                                {t('send')}
                            </button>

                            <div className="pt-6 text-center border-t border-white/5 flex flex-col items-center justify-center gap-2">
                                <p className="text-text-dim text-sm">{t('whatsapp')}</p>
                                <a
                                    href="https://wa.me/message/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-brand-red font-medium hover:text-white transition-colors"
                                >
                                    Message on WhatsApp
                                </a>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
