-- Crear tabla para planes de viaje
CREATE TABLE IF NOT EXISTS travel_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget TEXT,
  preferences TEXT[],
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  itinerary JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Crear índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_travel_plans_user_id ON travel_plans(user_id);

-- Crear política RLS para que los usuarios solo puedan ver sus propios planes
CREATE POLICY "Users can view their own travel plans"
  ON travel_plans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Crear política RLS para que los usuarios solo puedan insertar sus propios planes
CREATE POLICY "Users can insert their own travel plans"
  ON travel_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Crear política RLS para que los usuarios solo puedan actualizar sus propios planes
CREATE POLICY "Users can update their own travel plans"
  ON travel_plans
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Crear política RLS para que los usuarios solo puedan eliminar sus propios planes
CREATE POLICY "Users can delete their own travel plans"
  ON travel_plans
  FOR DELETE
  USING (auth.uid() = user_id);

-- Habilitar Row Level Security
ALTER TABLE travel_plans ENABLE ROW LEVEL SECURITY;

