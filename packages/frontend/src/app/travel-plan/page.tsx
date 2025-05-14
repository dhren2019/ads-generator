'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

export default function TravelPlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const fetchTravelPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('travel_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTravelPlans(data || []);
      } catch (err: any) {
        console.error('Error fetching travel plans:', err);
        setError('No se pudieron cargar los planes de viaje');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelPlans();
  }, [user, router]);

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

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Planes de Viaje</h1>
        <Link href="/travel-plan/new">
          <Button>Crear Nuevo Plan</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
          <span className="ml-2">Cargando planes de viaje...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : travelPlans.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500 mb-4">Aún no tienes planes de viaje</p>
          <Link href="/travel-plan/new">
            <Button>Crear tu primer plan</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelPlans.map((plan) => (
            <Link href={`/travel-plan/${plan.id}`} key={plan.id}>
              <Card className="p-4 h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold">{plan.title}</h2>
                  {getStatusBadge(plan.status)}
                </div>
                <p className="text-gray-600 mb-4">{plan.destination}</p>
                <div className="text-sm text-gray-500">
                  <div className="mb-1">
                    {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                  </div>
                  <div>Creado: {new Date(plan.created_at).toLocaleDateString()}</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

