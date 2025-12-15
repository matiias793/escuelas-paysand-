'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Building2, Trees, GraduationCap, Users, User } from 'lucide-react';
import { SchoolCard } from '@/components/SchoolCard';
import { SchoolDetailModal } from '@/components/SchoolDetailModal';
import { schools } from '@/data/schools';
import { School } from '@/types';
import { cn } from '@/lib/utils';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [activeTab, setActiveTab] = useState<'Urbana' | 'Rural'>('Urbana');

  // Rural Sub-filters
  const [ruralFilter, setRuralFilter] = useState<'ALL' | 'UNIDOCENTE' | 'PLURIDOCENTE' | 'CBR' | 'INTERNADOS'>('ALL');

  // Urban Sub-filters
  const [urbanFilter, setUrbanFilter] = useState<'ALL' | 'TIEMPO_COMPLETO' | 'TIEMPO_EXTENDIDO' | 'DOBLE_TURNO' | 'JARDIN' | 'ARTE' | 'EDIFICIO_COMPARTIDO'>('ALL');

  // Filter logic
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      // 1. Zone Filter (Strict)
      if (school.zone !== activeTab) return false;

      // 2. Rural Sub-filters
      if (activeTab === 'Rural') {
        if (ruralFilter === 'UNIDOCENTE' && school.ruralModal !== 'UNIDOCENTE') return false;
        if (ruralFilter === 'PLURIDOCENTE' && school.ruralModal !== 'PLURIDOCENTE') return false;
        if (ruralFilter === 'CBR' && !school.hasCBR) return false;
        if (ruralFilter === 'INTERNADOS' && !school.hasBoarding) return false;
      }

      // 3. Urban Sub-filters
      if (activeTab === 'Urbana') {
        if (urbanFilter === 'TIEMPO_COMPLETO' && school.category !== 'Tiempo Completo') return false;
        if (urbanFilter === 'TIEMPO_EXTENDIDO' && school.category !== 'Tiempo Extendido') return false;
        if (urbanFilter === 'DOBLE_TURNO' && school.category !== 'Doble Turno') return false;
        // Matches both JJC and JDT
        if (urbanFilter === 'JARDIN' && !school.category.includes('Jardín')) return false;
        if (urbanFilter === 'ARTE' && school.category !== 'Escuela de Arte') return false;
        // Filter by hasSharedBuilding flag
        if (urbanFilter === 'EDIFICIO_COMPARTIDO' && !school.hasSharedBuilding) return false;
      }

      // 4. Search match
      const searchLower = searchTerm.toLowerCase();
      if (!searchTerm) return true;

      const matchesSearch =
        school.name.toLowerCase().includes(searchLower) ||
        school.number.toString().includes(searchLower) ||
        school.contact.directorName.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [searchTerm, activeTab, ruralFilter, urbanFilter]);

  const handleTabChange = (tab: 'Urbana' | 'Rural') => {
    setActiveTab(tab);
    if (tab === 'Urbana') {
      setRuralFilter('ALL'); // Reset rural filter when switching to Urban
    } else {
      setUrbanFilter('ALL'); // Reset urban filter when switching to Rural
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* Navbar / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-blue-800">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg">
              <Image
                src="/logo.jpg"
                alt="Logo ANEP"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">Agenda Escolar</h1>
              <p className="text-[10px] uppercase font-semibold text-blue-600/70 tracking-wider">Paysandú</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Search Section */}
      <section className="bg-white border-b border-slate-200 pt-8 px-4 sm:px-6 lg:px-8 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Directorio de Escuelas
          </h2>

          <div className="relative max-w-xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white rounded-2xl transition-all shadow-sm text-base"
              placeholder="Buscar por número o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Main Tabs */}
          <div className="flex flex-col items-center">
            <div className="flex gap-4 border-b border-slate-200 w-full justify-center">
              <button
                onClick={() => handleTabChange('Urbana')}
                className={cn(
                  "flex items-center gap-2 pb-4 px-6 border-b-2 font-semibold transition-all text-sm sm:text-base",
                  activeTab === 'Urbana'
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                <Building2 className="w-5 h-5" />
                Urbanas
              </button>
              <button
                onClick={() => handleTabChange('Rural')}
                className={cn(
                  "flex items-center gap-2 pb-4 px-6 border-b-2 font-semibold transition-all text-sm sm:text-base",
                  activeTab === 'Rural'
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                <Trees className="w-5 h-5" />
                Rurales
              </button>
            </div>

            {/* Sub-filters for Rural */}
            {activeTab === 'Rural' && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-1 overflow-x-auto max-w-full pb-2 scrollbar-none">
                <div className="flex justify-center gap-2 w-max mx-auto px-4">
                  <button
                    onClick={() => setRuralFilter('ALL')}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap",
                      ruralFilter === 'ALL'
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-green-300"
                    )}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setRuralFilter('UNIDOCENTE')}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1 whitespace-nowrap",
                      ruralFilter === 'UNIDOCENTE'
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-green-300"
                    )}
                  >
                    <User className="w-3 h-3" />
                    Unidocentes
                  </button>
                  <button
                    onClick={() => setRuralFilter('PLURIDOCENTE')}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1 whitespace-nowrap",
                      ruralFilter === 'PLURIDOCENTE'
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-green-300"
                    )}
                  >
                    <Users className="w-3 h-3" />
                    Pluridocentes
                  </button>
                  <button
                    onClick={() => setRuralFilter('CBR')}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1 whitespace-nowrap",
                      ruralFilter === 'CBR'
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    )}
                  >
                    <GraduationCap className="w-3 h-3" />
                    Solo con CBR
                  </button>
                  <button
                    onClick={() => setRuralFilter('INTERNADOS')}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1 whitespace-nowrap",
                      ruralFilter === 'INTERNADOS'
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
                    )}
                  >
                    <Building2 className="w-3 h-3" />
                    Internados
                  </button>
                </div>
              </div>
            )}

            {/* Sub-filters for Urban */}
            {activeTab === 'Urbana' && (
              <div className="mt-6 animate-in fade-in slide-in-from-top-1 overflow-x-auto max-w-full pb-2 scrollbar-none">
                <div className="flex justify-start sm:justify-center gap-2 w-max mx-auto px-4">
                  {[
                    { id: 'ALL', label: 'Todas', activeClass: 'bg-blue-600 text-white border-blue-600' },
                    { id: 'TIEMPO_COMPLETO', label: 'Tiempo Completo', activeClass: 'bg-purple-600 text-white border-purple-600' },
                    { id: 'TIEMPO_EXTENDIDO', label: 'Tiempo Extendido', activeClass: 'bg-blue-600 text-white border-blue-600' },
                    { id: 'DOBLE_TURNO', label: 'Doble Turno', activeClass: 'bg-orange-600 text-white border-orange-600' },
                    { id: 'JARDIN', label: 'Jardines', activeClass: 'bg-pink-600 text-white border-pink-600' },
                    { id: 'ARTE', label: 'Arte', activeClass: 'bg-fuchsia-600 text-white border-fuchsia-600' },
                    { id: 'EDIFICIO_COMPARTIDO', label: 'Edificio Compartido', activeClass: 'bg-amber-600 text-white border-amber-600' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setUrbanFilter(tab.id as any)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap",
                        urbanFilter === tab.id
                          ? tab.activeClass
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Grid Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex justify-between items-center text-sm text-slate-500 font-medium">
          <span>
            Mostrando {activeTab.toLowerCase()}s
            {activeTab === 'Rural' && ruralFilter !== 'ALL' ? ` (${ruralFilter.toLowerCase()})` : ''}
            {activeTab === 'Urbana' && urbanFilter !== 'ALL' ? ` (${urbanFilter.replace('_', ' ').toLowerCase()})` : ''}
          </span>
          <span>{filteredSchools.length} resultados</span>
        </div>

        {filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onClick={setSelectedSchool}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No se encontraron escuelas</h3>
            <p className="text-slate-500">Intenta cambiar el criterio de búsqueda (o el filtro seleccionado).</p>
          </div>
        )}
      </section>

      {/* Modal */}
      <SchoolDetailModal
        school={selectedSchool}
        isOpen={!!selectedSchool}
        onClose={() => setSelectedSchool(null)}
      />

    </main>
  );
}
