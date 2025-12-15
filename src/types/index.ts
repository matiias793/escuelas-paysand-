export type SchoolCategory =
    | 'Tiempo Completo'
    | 'Doble Turno'
    | 'Tiempo Extendido'
    | 'Tiempo Pedagógico Ampliado'
    | 'Jardín de Jornada Completa'
    | 'Jardín de Jornada Doble Turno'
    | 'Escuela de Arte'
    | 'Especial'
    | 'Aprender'
    | 'Común'
    | 'Sin Categoría';

export type FoodServiceType =
    | 'Copa de leche'
    | 'Copa de leche + Almuerzo'
    | 'Doble copa de leche'
    | 'Doble copa de leche + Almuerzo'
    | 'Solo Almuerzo'
    | 'Régimen de Internado'
    | 'Sin Información';

export type StaffContractType =
    | 'ANEP (Presupuestado)'
    | 'Cooperativa'
    | 'Comisión Fomento'
    | 'MIDES';

export interface School {
    id: string;
    number: number;
    name: string;
    zone: 'Rural' | 'Urbana';
    location: {
        lat?: number;
        lng?: number;
        googleMapsLink?: string;
        address?: string;
    };
    category: SchoolCategory;
    hasBoarding: boolean;
    hasSharedBuilding?: boolean;
    hasCBR?: boolean;
    ruralModal?: 'UNIDOCENTE' | 'PLURIDOCENTE' | null;
    contact: {
        directorName: string;
        phone: string;
        email: string;
    };
    foodService: FoodServiceType | 'Sin Información';
    staff: {
        totalHours: number;
        contractTypes: StaffContractType[];
    };
    supplies: {
        hasWaterBudget: boolean;
    };
}
