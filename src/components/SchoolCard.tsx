import React from 'react';
import { School } from '@/types';
import { Phone, User, GraduationCap, Utensils, Star, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SchoolCardProps {
    school: School;
    onClick: (school: School) => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onClick }) => {
    return (
        <div
            onClick={() => onClick(school)}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 hover:border-blue-300 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col h-full ring-offset-2 hover:ring-2 hover:ring-blue-100"
        >
            {/* Accent Line */}
            <div className={cn(
                "absolute top-0 left-0 w-1 h-full transition-colors",
                school.zone === 'Rural' ? "bg-green-500" : "bg-blue-500"
            )} />

            <div className="p-5 flex flex-col h-full ml-1">

                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border",
                            school.zone === 'Rural'
                                ? "bg-green-50 border-green-100 text-green-700"
                                : "bg-blue-50 border-blue-100 text-blue-700"
                        )}>
                            {school.number}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 leading-none group-hover:text-blue-700 transition-colors">
                                {school.category.includes('Jardín') ? 'Jardín N°' : 'Escuela N°'} {school.number}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wide">
                                {school.zone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {school.category === 'Tiempo Completo' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider border border-purple-200">
                            <Clock className="w-3 h-3" />
                            Tiempo Completo
                        </span>
                    )}
                    {school.category === 'Tiempo Extendido' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                            <Clock className="w-3 h-3" />
                            Tiempo Extendido
                        </span>
                    )}
                    {school.category === 'Tiempo Pedagógico Ampliado' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-700 text-[10px] font-bold uppercase tracking-wider border border-cyan-200">
                            <Clock className="w-3 h-3" />
                            T. Pedagógico Ampliado
                        </span>
                    )}
                    {school.category === 'Doble Turno' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider border border-orange-200">
                            <Users className="w-3 h-3" />
                            Doble Turno
                        </span>
                    )}
                    {(school.category === 'Jardín de Jornada Completa' || school.category === 'Jardín de Jornada Doble Turno') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-100 text-pink-700 text-[10px] font-bold uppercase tracking-wider border border-pink-200">
                            <Star className="w-3 h-3" />
                            Jardín
                        </span>
                    )}
                    {school.category === 'Escuela de Arte' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-fuchsia-100 text-fuchsia-700 text-[10px] font-bold uppercase tracking-wider border border-fuchsia-200">
                            <Star className="w-3 h-3" />
                            Arte
                        </span>
                    )}
                    {school.category === 'Especial' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                            <Star className="w-3 h-3" />
                            Especial
                        </span>
                    )}
                    {school.hasSharedBuilding && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                            <Users className="w-3 h-3" />
                            Edificio Compartido
                        </span>
                    )}
                    {school.hasCBR && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
                            <GraduationCap className="w-3 h-3" />
                            Ciclo Básico
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-3 flex-grow border-t border-slate-50 pt-3">
                    <div className="flex items-start gap-3">
                        <User className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Dirección</p>
                            <p className="text-sm text-slate-700 font-medium line-clamp-1">
                                {school.contact.directorName || "Sin dato"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Utensils className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Alimentación</p>
                            <p className="text-sm text-slate-700 font-medium line-clamp-1">
                                {school.foodService}
                            </p>
                            {/* Water Budget Indicator */}
                            <div className="mt-1">
                                {school.supplies.hasWaterBudget ? (
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 w-fit mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        Partida de Agua
                                    </div>
                                ) : (
                                    school.zone === 'Rural' && (
                                        <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">
                                            Sin partida de agua
                                        </p>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
