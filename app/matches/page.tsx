'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faSpinner, faRefresh, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Match } from '@/types/match';
import { MatchService } from '@/lib/matches';
import MatchCard from '@/app/components/MatchCard';

interface GroupMatches {
  groupId: number;
  groupName: string;
  matches: Match[];
}

export default function MatchesPage() {
  const [groupMatches, setGroupMatches] = useState<GroupMatches[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all matches
      const allMatches = await MatchService.getMatches();
      
      // Group matches by group_id
      const grouped = new Map<number, GroupMatches>();
      
      allMatches.forEach(match => {
        if (!grouped.has(match.group_id)) {
          grouped.set(match.group_id, {
            groupId: match.group_id,
            groupName: match.group?.name || `Grupo ${match.group_id}`,
            matches: []
          });
        }
        grouped.get(match.group_id)!.matches.push(match);
      });
      
      // Convert to array and sort by group name
      const groupedArray = Array.from(grouped.values()).sort((a, b) => 
        a.groupName.localeCompare(b.groupName)
      );
      
      setGroupMatches(groupedArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar partidos');
      console.error('Error loading matches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredMatches = (matches: Match[]) => {
    if (filterStatus === 'all') return matches;
    return matches.filter(m => m.status === filterStatus);
  };

  const getTotalStats = () => {
    const allMatches = groupMatches.flatMap(g => g.matches);
    return {
      total: allMatches.length,
      pending: allMatches.filter(m => m.status === 'pending').length,
      completed: allMatches.filter(m => m.status === 'completed').length
    };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTable} className="text-blue-600 text-2xl mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  Partidos
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Todos los partidos del torneo
                </p>
              </div>
            </div>
            
            <button
              onClick={loadMatches}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faRefresh} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Total Partidos</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FontAwesomeIcon icon={faTable} className="text-blue-600 text-2xl" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Pendientes</p>
                <p className="text-2xl font-bold text-orange-400">{stats.pending}</p>
              </div>
              <FontAwesomeIcon icon={faSpinner} className="text-orange-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Completados</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <FontAwesomeIcon icon={faRefresh} className="text-green-400 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center space-x-2">
          <FontAwesomeIcon icon={faFilter} className="text-gray-400 text-sm" />
          <span className="text-xs text-gray-400">Filtrar:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-xs rounded ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 text-xs rounded ${
              filterStatus === 'pending'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Pendientes ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 text-xs rounded ${
              filterStatus === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Completados ({stats.completed})
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-xs font-medium text-red-200">
                  Error
                </h3>
                <div className="mt-2 text-xs text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && groupMatches.length === 0 ? (
          <div className="text-center py-8">
            <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-3xl animate-spin mb-4" />
            <p className="text-sm text-gray-400">Cargando partidos...</p>
          </div>
        ) : groupMatches.length === 0 ? (
          /* Empty State */
          <div className="bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faTable} className="text-gray-400 text-4xl mb-4" />
              <h3 className="text-sm font-medium text-white mb-2">
                No hay partidos disponibles
              </h3>
              <p className="text-xs text-gray-400">
                Inicia el torneo desde la página de Fase de Grupos para generar partidos.
              </p>
            </div>
          </div>
        ) : (
          /* Matches by Group */
          <div className="space-y-8">
            {groupMatches.map((group) => {
              const filteredMatches = getFilteredMatches(group.matches);
              if (filteredMatches.length === 0) return null;
              
              return (
                <div key={group.groupId}>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                    <FontAwesomeIcon icon={faTable} className="text-blue-600 mr-2 text-sm" />
                    {group.groupName}
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      ({filteredMatches.length} partidos)
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onMatchUpdated={loadMatches}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
