'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faLayerGroup, faSpinner, faArrowRight, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { GroupWithTeams } from '@/types/groupTeam';
import { GroupTeamService } from '@/lib/groupTeams';
import TeamAssignmentGrid from '@/app/components/TeamAssignmentGrid';

export default function AssignmentsPage() {
  const [groupsWithTeams, setGroupsWithTeams] = useState<GroupWithTeams[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalTeams: 0,
    assignedTeams: 0,
    unassignedTeams: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await GroupTeamService.getGroupsWithTeams();
      setGroupsWithTeams(data);
      
      // Calculate stats
      const totalGroups = data.length;
      const allTeams = data.flatMap(g => g.teams);
      const totalTeams = allTeams.length;
      const assignedTeams = allTeams.filter(t => t.assigned).length;
      const unassignedTeams = totalTeams - assignedTeams;
      
      setStats({
        totalGroups,
        totalTeams,
        assignedTeams,
        unassignedTeams
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignment data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignmentChange = () => {
    loadData(); // Reload data after assignment change
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-2xl mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Team Assignments
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Assign teams to groups for the tournament
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 text-lg mr-2" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Groups</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.totalGroups}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUsers} className="text-green-600 text-lg mr-2" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Teams</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.totalTeams}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-green-600 text-lg mr-2" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Assigned</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.assignedTeams}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faSpinner} className="text-orange-600 text-lg mr-2" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Unassigned</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.unassignedTeams}
                </p>
              </div>
            </div>
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

        {/* Assignment Grid */}
        <TeamAssignmentGrid
          groupsWithTeams={groupsWithTeams}
          onAssignmentChange={handleAssignmentChange}
          isLoading={isLoading}
        />

        {/* Instructions */}
        {!isLoading && groupsWithTeams.length > 0 && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-xs font-medium text-blue-800 dark:text-blue-200">
                  How to assign teams
                </h3>
                <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                  <p>• Click the <FontAwesomeIcon icon={faCheck} className="inline text-xs" /> button to assign a team to a group</p>
                  <p>• Click the <FontAwesomeIcon icon={faTimes} className="inline text-xs" /> button to remove a team from a group</p>
                  <p>• Teams can only be assigned to one group at a time</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
