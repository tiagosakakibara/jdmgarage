import ServicesDashboardClient from './ServicesDashboardClient';

export default function ServicesPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Gerenciamento de Serviços</h1>
            <ServicesDashboardClient />
        </div>
    );
}
