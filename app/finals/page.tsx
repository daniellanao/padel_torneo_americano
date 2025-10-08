'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrophy, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Final, CreateFinalData, UpdateFinalData } from '@/types/final';
import { getFinals, createFinal } from '@/lib/finals';
import FinalCard from '../components/FinalCard';
import FinalForm from '../components/FinalForm';

export default function FinalsPage() {
  const [finals, setFinals] = useState<Final[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFinals();
  }, []);

  const loadFinals = async () => {
    try {
      setLoading(true);
      setError(null);
      const finalsData = await getFinals();
      setFinals(finalsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar finales');
      console.error('Error loading finals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFinal = async (data: CreateFinalData | UpdateFinalData) => {
    try {
      setIsSubmitting(true);
      // Since we're only creating finals, we can safely cast to CreateFinalData
      await createFinal(data as CreateFinalData);
      setShowForm(false);
      await loadFinals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear final');
      console.error('Error creating final:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setError(null);
  };

  const groupFinalsByType = (finals: Final[]) => {
    const grouped = {
      quarter: finals.filter(f => f.type === 'quarter'),
      semis: finals.filter(f => f.type === 'semis'),
      final: finals.filter(f => f.type === 'final')
    };
    return grouped;
  };

  const groupedFinals = groupFinalsByType(finals);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-blue-600 mb-4" />
              <p className="text-gray-400">Cargando finales...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <FontAwesomeIcon icon={faTrophy} className="mr-3 text-yellow-500" />
                Finales del Torneo
              </h1>
              <p className="mt-2 text-gray-400">
                Gestiona cuartos de final, semifinales y el partido final
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar Partido Final
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 mr-2" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <FinalForm
              onSubmit={handleSubmitFinal}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Finals by Type */}
        <div className="space-y-8">
          {/* Quarter Finals */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Cuartos de Final ({groupedFinals.quarter.length})
            </h2>
            {groupedFinals.quarter.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedFinals.quarter.map((final) => (
                  <FinalCard
                    key={final.id}
                    final={final}
                    onFinalUpdated={loadFinals}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Aún no hay cuartos de final
              </div>
            )}
          </div>

          {/* Semi Finals */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Semifinales ({groupedFinals.semis.length})
            </h2>
            {groupedFinals.semis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedFinals.semis.map((final) => (
                  <FinalCard
                    key={final.id}
                    final={final}
                    onFinalUpdated={loadFinals}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Aún no hay semifinales
              </div>
            )}
          </div>

          {/* Final */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Final ({groupedFinals.final.length})
            </h2>
            {groupedFinals.final.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedFinals.final.map((final) => (
                  <FinalCard
                    key={final.id}
                    final={final}
                    onFinalUpdated={loadFinals}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Aún no hay partido final
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {finals.length === 0 && !loading && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faTrophy} className="text-6xl text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Aún no hay partidos de finales
            </h3>
            <p className="text-gray-400 mb-6">
              Comienza agregando tu primer partido final
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar Partido Final
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
