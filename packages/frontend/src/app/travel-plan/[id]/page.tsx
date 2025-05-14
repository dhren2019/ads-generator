'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TravelPlanDetails {
  id: string;
  title: string;
  description: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: string;
  preferences: string[];
  status: string;
  created_at: string;
  itinerary: any[];
}

export default function TravelPlanDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [travelPlan, setTravelPlan] = useState<TravelPlanDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const fetchTravelPlan = async () => {
      try {
        const { data, error } = await supabase
          .from('travel_plans')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setTravelPlan(data);
      } catch (err: any) {
        console.error('Error fetching travel plan:', err);
        setError('No se pudo cargar el plan de viaje');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelPlan();
  }, [params.id, user, router]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      'draft': { color: 'bg-gray-100 text-gray-800', label: 'Borrador' },
      'processing': { color: 'bg-blue-100 text-blue-800', label: 'Procesando' },
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completado' },
      'error': { color: 'bg-red-100 text-red-800', label: 'Error' }
    };

    const statusInfo = statusMap[status] || statusMap.draft;
    
    return (
      <span className={`${statusInfo.color} text-xs px-2 py-1 rounded`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este plan de viaje?')) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('travel_plans')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user?.id);

      if (error) throw error;
      router.push('/travel-plan');
    } catch (err: any) {
      console.error('Error deleting travel plan:', err);
      setError('No se pudo eliminar el plan de viaje');
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <Spinner />
        <span className="ml-2">Cargando plan de viaje...</span>
      </div>
    );
  }

  if (error || !travelPlan) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'No se encontró el plan de viaje'}
        </div>
        <Link href="/travel-plan">
          <Button>Volver a Mis Planes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/travel-plan" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Volver a Mis Planes
          </Link>
          <h1 className="text-2xl font-bold">{travelPlan.title}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDelete}>
            Eliminar
          </Button>
          <Link href={`/travel-plan/${params.id}/edit`}>
            <Button>Editar Plan</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Detalles del Viaje</h2>
              {getStatusBadge(travelPlan.status)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">Destino</div>
                <div className="font-medium">{travelPlan.destination}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Fechas</div>
                <div className="font-medium">
                  {formatDate(travelPlan.start_date)} - {formatDate(travelPlan.end_date)}
                </div>
              </div>
              
              {travelPlan.budget && (
                <div>
                  <div className="text-sm text-gray-500">Presupuesto</div>
                  <div className="font-medium">{travelPlan.budget}</div>
                </div>
              )}
              
              <div>
                <div className="text-sm text-gray-500">Creado</div>
                <div className="font-medium">{new Date(travelPlan.created_at).toLocaleString()}</div>
              </div>
            </div>
            
            {travelPlan.description && (
              <div className="mb-4">
                <div className="text-sm text-gray-500">Descripción</div>
                <div className="mt-1">{travelPlan.description}</div>
              </div>
            )}
            
            {travelPlan.preferences && travelPlan.preferences.length > 0 && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Preferencias</div>
                <div className="flex flex-wrap gap-1">
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
          </Card>

          {travelPlan.itinerary && travelPlan.itinerary.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Itinerario</h2>
              
              {travelPlan.itinerary.map((day: any) => (
                <div key={day.day} className="mb-6 last:mb-0">
                  <h3 className="font-medium border-b pb-2 mb-2">Día {day.day}</h3>
                  <ul className="space-y-3">
                    {day.activities.map((activity: any, index: number) => (
                      <li key={index} className="flex">
                        <span className="font-medium w-16">{activity.time}</span>
                        <span>{activity.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card>
          )}
        </div>
        
        <div>
          <Card className="p-4 sticky top-4">
            <h3 className="font-medium mb-3">Acciones</h3>
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                Descargar PDF
              </Button>
              <Button className="w-full" variant="outline">
                Compartir Plan
              </Button>
              <Button className="w-full" variant="outline">
                Añadir a Calendario
              </Button>
            </div>
            
            {travelPlan.status === 'completed' && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium mb-2">Recomendaciones</h4>
                <ul className="text-sm space-y-2">
                  <li>• Reserva tu alojamiento con anticipación</li>
                  <li>• Verifica los requisitos de visa si es necesario</li>
                  <li>• Contrata un seguro de viaje</li>
                  <li>• Revisa el pronóstico del tiempo antes de partir</li>
                </ul>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

