'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/Spinner';
import { TravelPlan } from './NewTravelPlan';

interface TravelPlanFormProps {
  travelPlan: TravelPlan;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePreferenceChange: (preference: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const preferenceOptions = [
  'Aventura',
  'Cultura',
  'Gastronomía',
  'Relax',
  'Compras',
  'Naturaleza',
  'Playa',
  'Montaña',
  'Urbano',
  'Rural'
];

export function TravelPlanForm({
  travelPlan,
  handleInputChange,
  handlePreferenceChange,
  handleSubmit,
  isLoading,
  error
}: TravelPlanFormProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Información del Viaje</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="title">Título del Viaje *</Label>
            <Input
              id="title"
              name="title"
              value={travelPlan.title}
              onChange={handleInputChange}
              placeholder="Ej: Vacaciones en Barcelona"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="destination">Destino *</Label>
            <Input
              id="destination"
              name="destination"
              value={travelPlan.destination}
              onChange={handleInputChange}
              placeholder="Ej: Barcelona, España"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="startDate">Fecha de Inicio *</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={travelPlan.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="endDate">Fecha de Fin *</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={travelPlan.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="budget">Presupuesto Aproximado</Label>
          <Input
            id="budget"
            name="budget"
            value={travelPlan.budget}
            onChange={handleInputChange}
            placeholder="Ej: 1000€"
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="description">Descripción del Viaje</Label>
          <Textarea
            id="description"
            name="description"
            value={travelPlan.description}
            onChange={handleInputChange}
            placeholder="Describe brevemente el propósito de tu viaje y cualquier detalle importante..."
            rows={4}
          />
        </div>
        
        <div className="mb-6">
          <Label>Preferencias de Viaje</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
            {preferenceOptions.map(preference => (
              <div key={preference} className="flex items-center">
                <input
                  type="checkbox"
                  id={`pref-${preference}`}
                  checked={travelPlan.preferences.includes(preference)}
                  onChange={() => handlePreferenceChange(preference)}
                  className="mr-2"
                />
                <label htmlFor={`pref-${preference}`}>{preference}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Generando Plan...
              </>
            ) : (
              'Generar Plan de Viaje'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

