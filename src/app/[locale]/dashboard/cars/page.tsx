import CarsDashboardClient from './CarsDashboardClient';

export default function CarsPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Gerenciamento de Inventário</h1>
            <CarsDashboardClient />
        </div>
    );
}
