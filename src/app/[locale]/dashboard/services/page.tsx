import ServicesDashboardClient from './ServicesDashboardClient';
import ServiceContentDashboard from './ServiceContentDashboard';

export default function ServicesPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Gerenciamento de Serviços</h1>
            
            <ServiceContentDashboard />
            
            <div className="mt-12 border-t border-white/5 pt-12">
                <h2 className="text-2xl font-bold text-white mb-6">Histórico de Registros</h2>
                <ServicesDashboardClient />
            </div>
        </div>
    );
}
