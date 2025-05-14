// Function to handle the complete step-by-step process
const handleStepByStepProcess = async () => {
  // Step 1: Search for flights
  if (currentStep === 1) {
    toast({
      title: 'Buscando vuelos',
      description: 'Enviando petición a SERP API para buscar vuelos...',
    });
    await handleSearchFlights();
    if (flightResults.length > 0) {
      toast({
        title: 'Búsqueda completada',
        description: `Se encontraron ${flightResults.length} vuelos. Avanzando al siguiente paso.`,
      });
      goToNextStep();
    }
  }
  // Step 2: Search for hotels
  else if (currentStep === 2) {
    toast({
      title: 'Buscando hoteles',
      description: 'Enviando petición a SERP API para buscar hoteles...',
    });
    await handleSearchHotels();
    if (hotelResults.length > 0) {
      toast({
        title: 'Búsqueda completada',
        description: `Se encontraron ${hotelResults.length} hoteles. Avanzando al siguiente paso.`,
      });
      goToNextStep();
    }
  }
  // Step 3: Search for activities
  else if (currentStep === 3) {
    toast({
      title: 'Buscando actividades',
      description: 'Enviando petición a SERP API para buscar actividades...',
    });
    await handleSearchActivities();
    if (activityResults.length > 0) {
      // Generate the complete JSON with all data
      const completeData: CompleteTravelPlanData = {
        flights: flightResults,
        hotels: hotelResults,
        activities: activityResults,
        destination: formData.destination,
        date_range: `${formData.departure_date} to ${formData.return_date}`,
      };
      
      setCompleteTravelPlanData(completeData);
      
      toast({
        title: 'Generando plan de viaje',
        description: 'Enviando petición a SERP API para generar información adicional del plan de viaje...',
      });
      
      // Generate additional travel plan data
      await handleGenerateTravelPlan();
      
      toast({
        title: 'Plan de viaje completo',
        description: 'Se ha generado el plan de viaje completo con todos los datos.',
      });
      
      goToNextStep();
    }
  }
};

const handleSearchFlights = async () => {
  if (!formData.origin || !formData.destination || !formData.departure_date) {
    toast({
      title: 'Información incompleta',
      description: 'Por favor, complete el origen, destino y fecha de salida para buscar vuelos',
      variant: 'destructive',
    });
    return;
  }

  setSearchingFlights(true);
  try {
    // Mostrar mensaje de petición a la API
    console.log('Enviando petición a SERP API para vuelos:', {
      origin: formData.origin,
      destination: formData.destination,
      departure_date: formData.departure_date,
      return_date: formData.return_date
    });
    
    // Call our edge function that uses SERP API
    const { data, error } = await supabase.functions.invoke('search-travel', {
      body: { 
        type: 'flights', 
        data: {
          origin: formData.origin,
          destination: formData.destination,
          departure_date: formData.departure_date,
          return_date: formData.return_date
        }
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    console.log('Respuesta de SERP API para vuelos:', data);
    
    if (data?.success) {
      // Process flight data
      const flights = data.data?.flights || [];
      
      // Map the SERP API data to our FlightResult format
      const mappedFlights: FlightResult[] = flights.slice(0, 5).map((flight: any, index: number) => ({
        id: `flight-${index}`,
        airline: flight.airline || 'Unknown Airline',
        flightNumber: flight.flight_number || 'Unknown',
        departureTime: flight.departure_time || 'Unknown',
        arrivalTime: flight.arrival_time || 'Unknown',
        duration: flight.duration || 'Unknown',
        price: flight.price || 'Unknown'
      }));
      
      setFlightResults(mappedFlights);
      
      toast({
        title: 'Vuelos encontrados',
        description: `Hemos encontrado ${mappedFlights.length} opciones de vuelo entre ${formData.origin} y ${formData.destination}`,
      });
    } else {
      toast({
        title: 'No se encontraron vuelos',
        description: 'Intente con diferentes fechas o destinos',
        variant: 'destructive',
      });
    }
  } catch (error: any) {
    console.error('Error buscando vuelos:', error);
    toast({
      title: 'Error',
      description: 'No se pudieron buscar vuelos en este momento. Por favor, inténtelo de nuevo más tarde.',
      variant: 'destructive',
    });
  } finally {
    setSearchingFlights(false);
  }
};

const handleSearchHotels = async () => {
  if (!formData.destination || !formData.departure_date) {
    toast({
      title: 'Información incompleta',
      description: 'Por favor, complete el destino y las fechas para buscar hoteles',
      variant: 'destructive',
    });
    return;
  }

  setSearchingHotels(true);
  try {
    // Mostrar mensaje de petición a la API
    console.log('Enviando petición a SERP API para hoteles:', {
      destination: formData.destination,
      check_in_date: formData.departure_date,
      check_out_date: formData.return_date
    });
    
    // Call our edge function that uses SERP API
    const { data, error } = await supabase.functions.invoke('search-travel', {
      body: { 
        type: 'hotels', 
        data: {
          destination: formData.destination,
          check_in_date: formData.departure_date,
          check_out_date: formData.return_date
        }
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    console.log('Respuesta de SERP API para hoteles:', data);
    
    if (data?.success) {
      // Process hotel data
      const hotels = data.data?.hotels || [];
      
      // Map the SERP API data to our HotelResult format
      const mappedHotels: HotelResult[] = hotels.slice(0, 5).map((hotel: any, index: number) => ({
        id: `hotel-${index}`,
        name: hotel.name || 'Hotel desconocido',
        address: hotel.address || 'Ubicación desconocida',
        rating: hotel.rating || 0,
        price: hotel.price || 'Precio desconocido',
        imageUrl: hotel.thumbnail || 'https://placehold.co/400x300?text=Hotel+Image'
      }));
      
      setHotelResults(mappedHotels);
      
      toast({
        title: 'Hoteles encontrados',
        description: `Hemos encontrado ${mappedHotels.length} opciones de hotel en ${formData.destination}`,
      });
    } else {
      toast({
        title: 'No se encontraron hoteles',
        description: 'Intente con un destino o fechas diferentes',
        variant: 'destructive',
      });
    }
  } catch (error: any) {
    console.error('Error buscando hoteles:', error);
    toast({
      title: 'Error',
      description: 'No se pudieron buscar hoteles en este momento. Por favor, inténtelo de nuevo más tarde.',
      variant: 'destructive',
    });
  } finally {
    setSearchingHotels(false);
  }
};

const handleSearchActivities = async () => {
  if (!formData.destination) {
    toast({
      title: 'Información incompleta',
      description: 'Por favor, complete el destino para buscar actividades',
      variant: 'destructive',
    });
    return;
  }

  setSearchingActivities(true);
  try {
    // Mostrar mensaje de petición a la API
    console.log('Enviando petición a SERP API para actividades:', {
      destination: formData.destination
    });
    
    // Call our edge function that uses Travily API
    const { data, error } = await supabase.functions.invoke('search-travel', {
      body: { 
        type: 'activities', 
        data: {
          destination: formData.destination
        }
      }
    });
    
    console.log('Respuesta de SERP API para actividades:', data);
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (data?.success) {
      // Process activities data
      const activities = data.data?.data || [];
      
      // Map the Travily API data to our ActivityResult format
      const mappedActivities: ActivityResult[] = activities.slice(0, 5).map((activity: any, index: number) => ({
        id: `activity-${index}`,
        name: activity.name || 'Actividad desconocida',
        description: activity.description || 'No hay descripción disponible',
        price: activity.price || 'Precio no disponible',
        imageUrl: activity.image_url || 'https://placehold.co/400x300?text=Activity+Image'
      }));
      
      setActivityResults(mappedActivities);
      
      // Use the activities in our form data
      if (mappedActivities.length > 0) {
        const activitiesText = mappedActivities.map(a => a.name).join(', ');
        setFormData(prev => ({
          ...prev,
          activities: activitiesText
        }));
      }
      
      toast({
        title: 'Actividades encontradas',
        description: `Hemos encontrado ${mappedActivities.length} actividades en ${formData.destination}`,
      });
    } else {
      toast({
        title: 'No se encontraron actividades',
        description: 'Intente con un destino diferente',
        variant: 'destructive',
      });
    }
  } catch (error: any) {
    console.error('Error buscando actividades:', error);
    toast({
      title: 'Error',
      description: 'No se pudieron buscar actividades en este momento. Por favor, inténtalo de nuevo más tarde.',
      variant: 'destructive',
    });
  } finally {
    setSearchingActivities(false);
  }
};

const handleGenerateTravelPlan = async () => {
  if (!formData.destination || !formData.departure_date || !formData.return_date) {
    toast({
      title: 'Información incompleta',
      description: 'Por favor, complete el destino y las fechas de viaje para generar un plan de viaje',
      variant: 'destructive',
    });
    return;
  }

  setGeneratingTravelPlan(true);
  try {
    // Mostrar mensaje de petición a la API
    console.log('Enviando petición a SERP API para generar plan de viaje:', {
      destination: formData.destination,
      departure_date: formData.departure_date,
      return_date: formData.return_date
    });
    
    // Call our edge function with the generate_travel_plan type
    const { data, error } = await supabase.functions.invoke('search-travel', {
      body: { 
        type: 'generate_travel_plan', 
        data: {
          destination: formData.destination,
          departure_date: formData.departure_date,
          return_date: formData.return_date
        }
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    console.log('Respuesta de SERP API para plan de viaje:', data);
    
    if (data?.success) {
      // Set the travel plan data
      setTravelPlanData(data.data);
      
      // Actualizar el JSON completo con la información adicional
      if (completeTravelPlanData) {
        setCompleteTravelPlanData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            weather: data.data.weather,
            cuisine: data.data.cuisine,
            packing_list: data.data.packing_list,
            places_to_visit: data.data.places_to_visit,
            city_image_url: data.data.city_image_url
          };
        });
      }
      
      toast({
        title: 'Plan de viaje generado',
        description: `Se ha generado un plan de viaje para ${formData.destination} con información sobre clima, lugares para visitar, gastronomía y más.`,
      });
    } else {
      toast({
        title: 'No se pudo generar el plan de viaje',
        description: 'Intente con un destino diferente',
        variant: 'destructive',
      });
    }
  } catch (error: any) {
    console.error('Error generando plan de viaje:', error);
    toast({
      title: 'Error',
      description: 'No se pudo generar el plan de viaje en este momento. Por favor, inténtalo más tarde.',
      variant: 'destructive',
    });
  } finally {
    setGeneratingTravelPlan(false);
  }
};
