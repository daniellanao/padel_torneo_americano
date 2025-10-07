'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Standing } from '@/types/standing';

interface StandingsTableProps {
  groupName: string;
  standings: Standing[];
  isLoading?: boolean;
}

export default function StandingsTable({ groupName, standings, isLoading = false }: StandingsTableProps) {
  const getTeamName = (standing: Standing) => {
    if (standing.team?.player1?.name && standing.team?.player2?.name) {
      return `${standing.team.player1.name} & ${standing.team.player2.name}`;
    }
    return `Team ${standing.team_id}`;
  };

  const calculateGameDifference = (standing: Standing) => {
    return standing.games_won - standing.games_lost;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faTrophy} className="text-blue-600 mr-2 text-sm" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {groupName}
          </h3>
        </div>
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No standings available for this group.
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faTrophy} className="text-blue-600 mr-2 text-sm" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {groupName}
            </h3>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {standings.length} teams
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pos
              </th>
              <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Team
              </th>
              <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                MP
              </th>
              <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                W
              </th>
              <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                L
              </th>
              <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                GW
              </th>
              <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                GL
              </th>
              <th scope="col" className="px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                GD
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedStandings.map((standing, index) => {
              const gameDiff = calculateGameDifference(standing);
              return (
                <tr key={standing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-2 whitespace-nowrap">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUsers} className="text-gray-400 mr-2 text-xs" />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {getTeamName(standing)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {standing.matches_played}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {standing.matches_won}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center">
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                      {standing.matches_lost}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {standing.games_won}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {standing.games_lost}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center">
                    <span className={`text-xs font-medium ${
                      gameDiff > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : gameDiff < 0 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-600 dark:text-gray-300'
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
      <div className="px-6 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          MP: Matches Played • W: Wins • L: Losses • GW: Games Won • GL: Games Lost • GD: Game Difference
        </p>
      </div>
    </div>
  );
}
