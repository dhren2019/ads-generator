'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/Spinner';
import { TravelPlan } from './NewTravelPlan';

interface TravelPlanResultsProps {
  generatedPlan: any;
  travelPlan: TravelPlan;
  handleSavePlan: () => Promise<void>;
  isLoading: boolean;
}

export function TravelPlanResults({
  generatedPlan,
  travelPlan,
  handleSavePlan,
  isLoading
}: TravelPlanResultsProps) {
  if (!generatedPlan) {
    return (
      <Card className="p-6 flex items-center justify-center h-64">
        <Spinner />
        <p className="ml-2">Cargando resultados...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Tu Plan de Viaje a {travelPlan.destination}</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Itinerario</h3>
          {generatedPlan.itinerary.map((day: any) => (
            <div key={day.day} className="mb-4">
              <h4 className="font-medium">Día {day.day}</h4>
              <ul className="ml-4 mt-2 space-y-2">
                {day.activities.map((activity: any, index: number) => (
                  <li key={index} className="flex">
                    <span className="font-medium w-16">{activity.time}</span>
                    <span>{activity.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Recomendaciones</h3>
          <ul className="list-disc ml-6">
            {generatedPlan.recommendations.map((rec: string, index: number) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Presupuesto Estimado</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-2">
              <div>Alojamiento:</div>
              <div className="text-right">{generatedPlan.estimated_budget.accommodation}</div>
              
              <div>Comida:</div>
              <div className="text-right">{generatedPlan.estimated_budget.food}</div>
              
              <div>Actividades:</div>
              <div className="text-right">{generatedPlan.estimated_budget.activities}</div>
              
              <div>Transporte:</div>
              <div className="text-right">{generatedPlan.estimated_budget.transportation}</div>
              
              <div className="font-medium">Total:</div>
              <div className="text-right font-medium">{generatedPlan.estimated_budget.total}</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline">Modificar Plan</Button>
          <Button onClick={handleSavePlan} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Guardando...
              </>
            ) : (
              'Guardar Plan'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

