'use client';

import { NewTravelPlan } from '@/components/NewTravelPlan';

export default function NewTravelPlanPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Plan de Viaje</h1>
      <NewTravelPlan />
    </div>
  );
}

