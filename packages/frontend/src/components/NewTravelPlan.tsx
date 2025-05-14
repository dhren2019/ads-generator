'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TravelPlanForm } from './TravelPlanForm';
import { TravelPlanResults } from './TravelPlanResults';
import { TravelPlanSidebar } from './TravelPlanSidebar';

export interface TravelPlan {
  id?: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  preferences: string[];
  userId: string;
  createdAt?: string;
  itinerary?: any[];
  status: 'draft' | 'processing' | 'completed' | 'error';
}

export function NewTravelPlan() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [travelPlan, setTravelPlan] = useState<TravelPlan>({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    preferences: [],
    userId: user?.id || '',
    status: 'draft'
  });
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTravelPlan(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (preference: string) => {
    setTravelPlan(prev => {
      const preferences = prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference];
      return { ...prev, preferences };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar campos requeridos
      if (!travelPlan.title || !travelPlan.destination || !travelPlan.startDate || !travelPlan.endDate) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      // Guardar el plan en Supabase
      const { data, error } = await supabase
        .from('travel_plans')
        .insert([
          { 
            ...travelPlan,
            user_id: user?.id,
            created_at: new Date().toISOString(),
            status: 'processing'
          }
        ])
        .select();

      if (error) throw error;

      // Simular generación de plan (en producción, esto llamaría a una API de IA)
      setTimeout(() => {
        const mockGeneratedPlan = {
          itinerary: [
            {
              day: 1,
              activities: [
                { time: '09:00', description: 'Desayuno en el hotel' },
                { time: '10:30', description: 'Visita al museo principal' },
                { time: '13:00', description: 'Almuerzo en restaurante local' },
                { time: '15:00', description: 'Tour por el casco histórico' },
                { time: '19:00', description: 'Cena en restaurante recomendado' }
              ]
            },
            {
              day: 2,
              activities: [
                { time: '08:30', description: 'Desayuno en el hotel' },
                { time: '10:00', description: 'Excursión a sitios naturales' },
                { time: '13:30', description: 'Picnic al aire libre' },
                { time: '16:00', description: 'Tiempo libre para compras' },
                { time: '20:00', description: 'Cena y espectáculo cultural' }
              ]
            }
          ],
          recommendations: [
            'Lleva ropa cómoda para las caminatas',
            'No olvides tu cámara para capturar los paisajes',
            'Reserva con anticipación los tours populares',
            'Prueba la gastronomía local en mercados tradicionales'
          ],
          estimated_budget: {
            accommodation: '€300',
            food: '€200',
            activities: '€150',
            transportation: '€100',
            total: '€750'
          }
        };

        setGeneratedPlan(mockGeneratedPlan);
        setCurrentStep(2);
        setIsLoading(false);
        
        // Actualizar el estado del plan a completado
        supabase
          .from('travel_plans')
          .update({ 
            status: 'completed',
            itinerary: mockGeneratedPlan.itinerary
          })
          .eq('id', data[0].id);
          
      }, 3000); // Simular tiempo de procesamiento

      setSuccess('¡Plan de viaje creado con éxito!');
    } catch (err: any) {
      setError(err.message || 'Ha ocurrido un error al crear el plan de viaje');
      setIsLoading(false);
    }
  };

  const handleSavePlan = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para guardar el plan finalizado
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Plan guardado correctamente');
      router.push('/travel-plan');
    } catch (err: any) {
      setError(err.message || 'Error al guardar el plan');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // No renderizar nada si no hay usuario
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-3/4">
        {currentStep === 1 ? (
          <TravelPlanForm 
            travelPlan={travelPlan}
            handleInputChange={handleInputChange}
            handlePreferenceChange={handlePreferenceChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <TravelPlanResults 
            generatedPlan={generatedPlan}
            travelPlan={travelPlan}
            handleSavePlan={handleSavePlan}
            isLoading={isLoading}
          />
        )}
      </div>
      
      <div className="w-full md:w-1/4">
        <TravelPlanSidebar 
          currentStep={currentStep}
          travelPlan={travelPlan}
        />
      </div>
      
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
    </div>
  );
}

