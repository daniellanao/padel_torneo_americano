'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faSpinner, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Standing } from '@/types/standing';
import { StandingService } from '@/lib/standings';
import StandingsTable from '@/app/components/StandingsTable';

interface GroupStandings {
  groupId: number;
  groupName: string;
  standings: Standing[];
}

export default function HomePage() {
  const [groupStandings, setGroupStandings] = useState<GroupStandings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStandings();
  }, []);

  const loadStandings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all standings
      const allStandings = await StandingService.getStandings();
      
      // Group standings by group_id
      const grouped = new Map<number, GroupStandings>();
      
      allStandings.forEach(standing => {
        if (!grouped.has(standing.group_id)) {
          grouped.set(standing.group_id, {
            groupId: standing.group_id,
            groupName: standing.group?.name || `Group ${standing.group_id}`,
            standings: []
          });
        }
        grouped.get(standing.group_id)!.standings.push(standing);
      });
      
      // Convert to array and sort by group name
      const groupedArray = Array.from(grouped.values()).sort((a, b) => 
        a.groupName.localeCompare(b.groupName)
      );
      
      setGroupStandings(groupedArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las clasificaciones');
      console.error('Error loading standings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTrophy} className="text-blue-600 text-2xl mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white dark:text-white">
                  Inicio
                </h1>
                <p className="text-sm text-white mt-1">
                  Inicio del torneo
                </p>
              </div>
        </div>

            <button
              onClick={loadStandings}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faRefresh} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-xs font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <div className="mt-2 text-xs text-red-700 dark:text-red-300">
                  {error}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setError(null)}
                    className="text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && groupStandings.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <StandingsTable
                key={i}
                groupName="Cargando..."
                standings={[]}
                isLoading={true}
              />
            ))}
          </div>
        ) : groupStandings.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faTrophy} className="text-gray-400 text-4xl mb-4" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                No hay clasificaciones disponibles
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Inicia el torneo desde la página de Fase de Grupos para generar las clasificaciones.
              </p>
            </div>
          </div>
        ) : (
          /* Standings Tables */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groupStandings.map((group, index) => {
              const colors = ['red', 'blue', 'yellow', 'green'] as const;
              const groupColor = colors[index % colors.length];
              return (
                <StandingsTable
                  key={group.groupId}
                  groupName={group.groupName}
                  standings={group.standings}
                  groupColor={groupColor}
                />
              );
            })}
          </div>
        )}

        {/* Info Box */}
        {!isLoading && groupStandings.length > 0 && (
          <div className="mt-8 bg-gray-900 border border-gray-700 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faTrophy} className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-xs font-medium text-white">
                  Cómo funcionan las clasificaciones
                </h3>
                <div className="mt-2 text-xs text-gray-300">
                  <p>• Los equipos se clasifican primero por número de victorias</p>
                  <p>• Los empates se deshacen por diferencia de juegos (JG - JP)</p>
                  <p>• Haz clic en el botón Actualizar para actualizar las clasificaciones</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
