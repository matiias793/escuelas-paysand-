'use client';

import React, { useState, useMemo } from 'react';
import { Search, School as SchoolIcon, Building2, Trees } from 'lucide-react';
import { SchoolCard } from '@/components/SchoolCard';
import { SchoolDetailModal } from '@/components/SchoolDetailModal';
import { schools } from '@/data/schools';
import { School } from '@/types';
import { cn } from '@/lib/utils';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [activeTab, setActiveTab] = useState<'Urbana' | 'Rural'>('Urbana');

  // Filter logic
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      // 1. Zone Filter (Strict)
      if (school.zone !== activeTab) return false;

      // 2. Search match
      const searchLower = searchTerm.toLowerCase();
      if (!searchTerm) return true;

      const matchesSearch =
        school.name.toLowerCase().includes(searchLower) ||
        school.number.toString().includes(searchLower) ||
        school.contact.directorName.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [searchTerm, activeTab]);

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* Navbar / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-800">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <SchoolIcon className="w-6 h-6 text-white" />
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
          <div className="flex gap-4 border-b border-slate-200 w-full justify-center">
            <button
              onClick={() => setActiveTab('Urbana')}
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
              onClick={() => setActiveTab('Rural')}
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
        </div>
      </section>

      {/* Grid Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex justify-between items-center text-sm text-slate-500 font-medium">
          <span>Mostrando {activeTab.toLowerCase()}s</span>
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
            <p className="text-slate-500">Intenta cambiar el criterio de búsqueda.</p>
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
