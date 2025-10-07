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

export default function StandingsPage() {
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
      setError(err instanceof Error ? err.message : 'Failed to load standings');
      console.error('Error loading standings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTrophy} className="text-blue-600 text-2xl mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Standings
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Tournament standings by group
                </p>
              </div>
            </div>
            
            <button
              onClick={loadStandings}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faRefresh} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
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
                    Dismiss
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
                groupName="Loading..."
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
                No Standings Available
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Start the tournament from the Group Stage page to generate standings.
              </p>
            </div>
          </div>
        ) : (
          /* Standings Tables */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groupStandings.map((group) => (
              <StandingsTable
                key={group.groupId}
                groupName={group.groupName}
                standings={group.standings}
              />
            ))}
          </div>
        )}

        {/* Info Box */}
        {!isLoading && groupStandings.length > 0 && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faTrophy} className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-xs font-medium text-blue-800 dark:text-blue-200">
                  How Standings Work
                </h3>
                <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                  <p>• Teams are ranked first by number of wins</p>
                  <p>• Ties are broken by game difference (GW - GL)</p>
                  <p>• Click the Refresh button to update standings</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
