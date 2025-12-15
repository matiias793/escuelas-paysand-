-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types for data integrity matching the TypeScript types
CREATE TYPE school_category AS ENUM (
    'Tiempo Completo',
    'Doble Turno',
    'Tiempo Extendido',
    'Especial',
    'Aprender',
    'Común'
);

CREATE TYPE food_service_type AS ENUM (
    'Copa de leche',
    'Copa de leche + Almuerzo',
    'Doble copa de leche',
    'Doble copa de leche + Almuerzo',
    'Régimen de Internado'
);

CREATE TYPE zone_type AS ENUM ('Rural', 'Urbana');

-- Schools Table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Identification
    number INTEGER NOT NULL,
    name TEXT NOT NULL,
    zone zone_type NOT NULL,
    
    -- Location
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    google_maps_link TEXT,
    address TEXT,
    
    -- Typology
    category school_category NOT NULL,
    has_boarding BOOLEAN DEFAULT FALSE,
    
    -- Contact
    director_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    
    -- Services
    food_service food_service_type,
    
    -- Supplies
    has_water_budget BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    search_vector TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('spanish', coalesce(name, '')), 'A') || 
        setweight(to_tsvector('spanish', coalesce(director_name, '')), 'B') ||
        setweight(to_tsvector('spanish', coalesce(number::text, '')), 'A')
    ) STORED
);

-- Staff Table (Many-to-Many or One-to-Many relation with schools)
-- Since one school can have multiple contract types, and we need total hours.
-- If we just want to store the summary as per requirements, we could use JSONB,
-- but a relational table is cleaner for "Types of Contract".

CREATE TABLE school_staff_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    total_hours INTEGER DEFAULT 0,
    contract_types TEXT[] -- Storing as array for simplicity as per requirement "Multi-select"
);

-- Index for search
CREATE INDEX schools_search_idx ON schools USING GIN (search_vector);
