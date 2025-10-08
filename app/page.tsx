'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faUsers, faTable, faMedal, faSpinner, faRefresh } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [tournamentStats, setTournamentStats] = useState({
    totalPlayers: 0,
    totalTeams: 0,
    totalGroups: 0,
    totalMatches: 0,
    completedMatches: 0,
    pendingMatches: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTournamentStats();
  }, []);

  const loadTournamentStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular carga de estadísticas del torneo
      // En una implementación real, harías llamadas a las APIs correspondientes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTournamentStats({
        totalPlayers: 24,
        totalTeams: 12,
        totalGroups: 3,
        totalMatches: 18,
        completedMatches: 12,
        pendingMatches: 6
      });
    } catch (err) {
      setError('Error al cargar las estadísticas del torneo');
      console.error('Error loading tournament stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Jugadores',
      value: tournamentStats.totalPlayers,
      icon: faUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Equipos',
      value: tournamentStats.totalTeams,
      icon: faTrophy,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Grupos',
      value: tournamentStats.totalGroups,
      icon: faTable,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Partidos',
      value: tournamentStats.totalMatches,
      icon: faMedal,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTrophy} className="text-blue-600 text-2xl mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Torneo La Caja Padel
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Sistema de gestión de torneo de pádel
                </p>
              </div>
            </div>
            
            <button
              onClick={loadTournamentStats}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-lg p-3 mr-4`}>
                  <FontAwesomeIcon icon={stat.icon} className={`${stat.color} text-xl`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isLoading ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tournament Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Progreso del Torneo
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Partidos Completados</span>
                <span className="text-gray-900 dark:text-white">
                  {tournamentStats.completedMatches} / {tournamentStats.totalMatches}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${tournamentStats.totalMatches > 0 ? (tournamentStats.completedMatches / tournamentStats.totalMatches) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Partidos Pendientes</span>
                <span className="text-gray-900 dark:text-white">{tournamentStats.pendingMatches}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${tournamentStats.totalMatches > 0 ? (tournamentStats.pendingMatches / tournamentStats.totalMatches) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faTrophy} className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                ¡Bienvenido al Torneo La Caja Padel!
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>• Navega por las diferentes secciones usando el menú superior</p>
                <p>• Gestiona jugadores, equipos y grupos desde el pie de página</p>
                <p>• Sigue el progreso del torneo en tiempo real</p>
                <p>• Consulta los partidos y clasificaciones actualizadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
