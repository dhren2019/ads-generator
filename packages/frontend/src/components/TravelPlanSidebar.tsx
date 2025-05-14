'use client';

import { Card } from '@/components/ui/card';
import { TravelPlan } from './NewTravelPlan';

interface TravelPlanSidebarProps {
  currentStep: number;
  travelPlan: TravelPlan;
}

export function TravelPlanSidebar({
  currentStep,
  travelPlan
}: TravelPlanSidebarProps) {
  // Calcular la duración del viaje en días
  const calculateDuration = () => {
    if (!travelPlan.startDate || !travelPlan.endDate) return 0;
    
    const start = new Date(travelPlan.startDate);
    const end = new Date(travelPlan.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Resumen del Plan</h3>
      
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">Progreso</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: currentStep === 1 ? '50%' : '100%' }}
            ></div>
          </div>
          <div className="text-sm mt-1">
            {currentStep === 1 ? 'Paso 1 de 2: Información del viaje' : 'Paso 2 de 2: Plan generado'}
          </div>
        </div>
        
        {travelPlan.title && (
          <div>
            <div className="text-sm text-gray-500">Título</div>
            <div className="font-medium">{travelPlan.title}</div>
          </div>
        )}
        
        {travelPlan.destination && (
          <div>
            <div className="text-sm text-gray-500">Destino</div>
            <div className="font-medium">{travelPlan.destination}</div>
          </div>
        )}
        
        {travelPlan.startDate && travelPlan.endDate && (
          <div>
            <div className="text-sm text-gray-500">Fechas</div>
            <div className="font-medium">
              {new Date(travelPlan.startDate).toLocaleDateString()} - {new Date(travelPlan.endDate).toLocaleDateString()}
              <div className="text-sm text-gray-500">
                ({calculateDuration()} {calculateDuration() === 1 ? 'día' : 'días'})
              </div>
            </div>
          </div>
        )}
        
        {travelPlan.budget && (
          <div>
            <div className="text-sm text-gray-500">Presupuesto</div>
            <div className="font-medium">{travelPlan.budget}</div>
          </div>
        )}
        
        {travelPlan.preferences.length > 0 && (
          <div>
            <div className="text-sm text-gray-500">Preferencias</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {travelPlan.preferences.map(pref => (
                <span 
                  key={pref} 
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium mb-2">Consejos</h4>
        <ul className="text-sm space-y-2">
          <li>• Incluye detalles específicos para obtener un plan más personalizado</li>
          <li>• Especifica tu presupuesto para recomendaciones más precisas</li>
          <li>• Selecciona tus preferencias para actividades más relevantes</li>
        </ul>
      </div>
    </Card>
  );
}

