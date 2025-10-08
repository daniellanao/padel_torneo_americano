'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Standing } from '@/types/standing';

interface StandingsTableProps {
  groupName: string;
  standings: Standing[];
  isLoading?: boolean;
  groupColor?: 'red' | 'blue' | 'yellow' | 'green';
}

export default function StandingsTable({ groupName, standings, isLoading = false, groupColor = 'blue' }: StandingsTableProps) {
  const getTeamName = (standing: Standing) => {
    if (standing.team?.player1?.name && standing.team?.player2?.name) {
      return `${standing.team.player1.name} & ${standing.team.player2.name}`;
    }
    return `Team ${standing.team_id}`;
  };

  const calculateGameDifference = (standing: Standing) => {
    return standing.games_won - standing.games_lost;
  };

  const getGroupColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-600 border-red-500';
      case 'blue':
        return 'bg-blue-600 border-blue-500';
      case 'yellow':
        return 'bg-yellow-500 border-yellow-400';
      case 'green':
        return 'bg-green-600 border-green-500';
      default:
        return 'bg-blue-600 border-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-700">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faTrophy} className="text-blue-400 mr-2 text-lg" />
          <h3 className="text-lg font-semibold text-white">
            {groupName}
          </h3>
        </div>
        <div className="text-center py-4">
          <p className="text-base text-gray-400">
            No hay clasificaciones disponibles para este grupo.
          </p>
        </div>
      </div>
    );
  }

  // Sort standings by wins (descending), then by game difference (descending)
  const sortedStandings = [...standings].sort((a, b) => {
    if (b.matches_won !== a.matches_won) {
      return b.matches_won - a.matches_won;
    }
    return calculateGameDifference(b) - calculateGameDifference(a);
  });

  return (
    <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
      {/* Header */}
      <div className={`px-6 py-4 ${getGroupColorClasses(groupColor)} border-b border-gray-600`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faTrophy} className="text-white mr-3 text-xl" />
            <h3 className="text-xl font-semibold text-white">
              {groupName}
            </h3>
          </div>
          <span className="text-sm text-white bg-black bg-opacity-20 px-3 py-1 rounded">
            {standings.length} equipos
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Pos
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Equipo
              </th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                PJ
              </th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                G
              </th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                P
              </th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                GG
              </th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                GP
              </th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                Dif
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-600">
            {sortedStandings.map((standing, index) => {
              const gameDiff = calculateGameDifference(standing);
              return (
                <tr key={standing.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-base font-bold text-white">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUsers} className="text-gray-400 mr-2 text-base" />
                      <span className="text-base font-medium text-white">
                        {getTeamName(standing)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-base text-gray-300">
                      {standing.matches_played}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-base font-medium text-green-400">
                      {standing.matches_won}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-base font-medium text-red-400">
                      {standing.matches_lost}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-base text-gray-300">
                      {standing.games_won}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-base text-gray-300">
                      {standing.games_lost}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-base font-medium ${
                      gameDiff > 0 
                        ? 'text-green-400' 
                        : gameDiff < 0 
                        ? 'text-red-400' 
                        : 'text-gray-300'
                    }`}>
                      {gameDiff > 0 ? '+' : ''}{gameDiff}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-gray-800 border-t border-gray-600">
        <p className="text-sm text-gray-400">
          PJ: Partidos Jugados • G: Ganados • P: Perdidos • GG: Games Ganados • GP: Games Perdidos • Dif: Diferencia
        </p>
      </div>
    </div>
  );
}
