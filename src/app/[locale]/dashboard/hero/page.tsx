import HeroDashboardClient from './HeroDashboardClient';

export default function HeroPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Gerenciamento do Hero Slider</h1>
            <HeroDashboardClient />
        </div>
    );
}
