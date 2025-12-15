import React from 'react';
import { School } from '@/types';
import { X, Phone, Mail, MapPin, Coffee, Utensils, Droplets, Users, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SchoolDetailModalProps {
    school: School | null;
    isOpen: boolean;
    onClose: () => void;
}

export const SchoolDetailModal: React.FC<SchoolDetailModalProps> = ({ school, isOpen, onClose }) => {
    if (!isOpen || !school) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">

                {/* Header Section */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-start sticky top-0 z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                                "text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
                                school.zone === 'Rural'
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                            )}>
                                {school.zone}
                            </span>
                            <span className="text-slate-400 text-xs font-semibold">#{school.number}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{school.name}</h2>
                        <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {school.location.address || 'Ubicación no especificada'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors border border-slate-200 shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-6">

                    {/* Map Placeholder */}
                    <div className="w-full h-48 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-200/50 pattern-grid-lg opacity-20" />

                        {school.location.googleMapsLink ? (
                            <a
                                href={school.location.googleMapsLink}
                                target="_blank"
                                rel="noreferrer"
                                className="z-10 bg-white shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-blue-600 flex items-center gap-2 hover:shadow-md transition-all"
                            >
                                <MapPin className="w-4 h-4" />
                                Ver en Google Maps
                            </a>
                        ) : (
                            <span className="text-slate-400 text-sm italic">Sin ubicación en mapa</span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* Gestión / Contacto */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-blue-600" />
                                Gestión y Contacto
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-medium mb-1">Dirección</p>
                                    <p className="font-medium text-slate-800">{school.contact.directorName}</p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    {school.contact.phone && (
                                        <a href={`tel:${school.contact.phone}`} className="flex-1 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm">
                                            <Phone className="w-4 h-4" />
                                            Llamar
                                        </a>
                                    )}
                                    {school.contact.email && (
                                        <a href={`mailto:${school.contact.email}`} className="flex-1 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </a>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Alimentación */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-orange-500" />
                                Servicio de Comedor
                            </h3>
                            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 h-full flex flex-col justify-center items-center text-center">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 text-orange-600">
                                    {school.foodService.includes('Almuerzo') || school.foodService.includes('Cena') ? (
                                        <Utensils className="w-6 h-6" />
                                    ) : (
                                        <Coffee className="w-6 h-6" />
                                    )}
                                </div>
                                <p className="font-semibold text-slate-800">{school.foodService}</p>
                                {school.hasBoarding && (
                                    <span className="mt-2 text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-bold">
                                        Internado
                                    </span>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Recursos Humanos - Auxiliares */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <Users className="w-4 h-4 text-slate-600" />
                                Equipo Auxiliar
                            </h3>
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                                    <span className="text-slate-600 text-sm">Total de Horas</span>
                                    <span className="font-bold text-lg text-slate-900">{school.staff.totalHours} hs</span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs text-slate-400 uppercase font-medium">Tipos de Contrato</p>
                                    <div className="flex flex-wrap gap-2">
                                        {school.staff.contractTypes.map((type) => (
                                            <span key={type} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium border border-slate-200">
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Infraestructura / Suministros */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-cyan-600" />
                                Infraestructura
                            </h3>
                            <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-100 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Partida de Agua</p>
                                    <p className="text-xs text-slate-500 mt-1">Suministro para agua potable</p>
                                </div>
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    school.supplies.hasWaterBudget ? "bg-cyan-100 text-cyan-600" : "bg-slate-100 text-slate-400"
                                )}>
                                    <Droplets className="w-5 h-5" />
                                </div>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};
