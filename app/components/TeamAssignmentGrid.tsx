'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faLayerGroup, faCheck, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GroupWithTeams, TeamAssignment } from '@/types/groupTeam';
import { GroupTeamService } from '@/lib/groupTeams';

interface TeamAssignmentGridProps {
  groupsWithTeams: GroupWithTeams[];
  onAssignmentChange: () => void;
  isLoading: boolean;
}

export default function TeamAssignmentGrid({ groupsWithTeams, onAssignmentChange, isLoading }: TeamAssignmentGridProps) {
  const [assigning, setAssigning] = useState<{ groupId: number; teamId: number } | null>(null);

  const handleToggleAssignment = async (groupId: number, teamId: number) => {
    try {
      setAssigning({ groupId, teamId });
      await GroupTeamService.toggleTeamAssignment(groupId, teamId);
      onAssignmentChange();
    } catch (error) {
      console.error('Error toggling assignment:', error);
    } finally {
      setAssigning(null);
    }
  };

  const getTeamDisplayName = (team: TeamAssignment['team']) => {
    if (team.player1 && team.player2) {
      return `${team.player1.name} & ${team.player2.name}`;
    }
    return `Team ${team.id}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (groupsWithTeams.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <FontAwesomeIcon icon={faLayerGroup} className="text-gray-400 text-4xl mb-4" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            No Groups Found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Create groups first to assign teams.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupsWithTeams.map((groupData) => (
        <div key={groupData.group.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {/* Group Header */}
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 text-sm" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {groupData.group.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({groupData.teams.filter(t => t.assigned).length} teams)
                </span>
              </div>
            </div>
          </div>

          {/* Teams Grid */}
          <div className="p-6">
            {/* Show assigned teams */}
            {groupData.teams.filter(t => t.assigned).length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Assigned Teams ({groupData.teams.filter(t => t.assigned).length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupData.teams
                    .filter(teamAssignment => teamAssignment.assigned)
                    .map((teamAssignment) => {
                      const isAssigning = assigning?.groupId === groupData.group.id && 
                                        assigning?.teamId === teamAssignment.team.id;
                      
                      return (
                        <div
                          key={teamAssignment.team.id}
                          className="relative p-3 rounded-lg border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <FontAwesomeIcon 
                                  icon={faUsers} 
                                  className="text-xs text-green-600 dark:text-green-400" 
                                />
                                <span className="text-xs font-medium truncate text-green-800 dark:text-green-200">
                                  {getTeamDisplayName(teamAssignment.team)}
                                </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleToggleAssignment(groupData.group.id, teamAssignment.team.id)}
                              disabled={isAssigning}
                              className="ml-2 p-1 rounded-full transition-colors text-green-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 disabled:opacity-50"
                              title="Remove from group"
                            >
                              {isAssigning ? (
                                <FontAwesomeIcon icon={faSpinner} className="text-xs animate-spin" />
                              ) : (
                                <FontAwesomeIcon icon={faTimes} className="text-xs" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Show available teams to assign */}
            {groupData.teams.filter(t => !t.assigned).length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Available Teams ({groupData.teams.filter(t => !t.assigned).length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupData.teams
                    .filter(teamAssignment => !teamAssignment.assigned)
                    .map((teamAssignment) => {
                      const isAssigning = assigning?.groupId === groupData.group.id && 
                                        assigning?.teamId === teamAssignment.team.id;
                      
                      return (
                        <div
                          key={teamAssignment.team.id}
                          className="relative p-3 rounded-lg border-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <FontAwesomeIcon 
                                  icon={faUsers} 
                                  className="text-xs text-gray-400" 
                                />
                                <span className="text-xs font-medium truncate text-gray-600 dark:text-gray-300">
                                  {getTeamDisplayName(teamAssignment.team)}
                                </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleToggleAssignment(groupData.group.id, teamAssignment.team.id)}
                              disabled={isAssigning}
                              className="ml-2 p-1 rounded-full transition-colors text-gray-400 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 disabled:opacity-50"
                              title="Add to group"
                            >
                              {isAssigning ? (
                                <FontAwesomeIcon icon={faSpinner} className="text-xs animate-spin" />
                              ) : (
                                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Show message if no teams available */}
            {groupData.teams.length === 0 && (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No teams available to assign.
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
