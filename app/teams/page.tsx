'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUsers, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Team, CreateTeamData, UpdateTeamData } from '@/types/team';
import { TeamService } from '@/lib/teams';
import TeamForm from '@/app/components/TeamForm';
import TeamList from '@/app/components/TeamList';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load teams on component mount
  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const teamsData = await TeamService.getTeams();
      setTeams(teamsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teams');
      console.error('Error loading teams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async (data: CreateTeamData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const newTeam = await TeamService.createTeam(data);
      setTeams(prev => [...prev, newTeam]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
      console.error('Error creating team:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTeam = async (data: UpdateTeamData) => {
    if (!editingTeam) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const updatedTeam = await TeamService.updateTeam(editingTeam.id, data);
      setTeams(prev => 
        prev.map(team => 
          team.id === editingTeam.id ? updatedTeam : team
        )
      );
      setEditingTeam(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team');
      console.error('Error updating team:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async (id: number) => {
    try {
      setError(null);
      await TeamService.deleteTeam(id);
      setTeams(prev => prev.filter(team => team.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team');
      console.error('Error deleting team:', err);
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTeam(null);
  };

  const handleFormSubmit = async (data: CreateTeamData | UpdateTeamData) => {
    if (editingTeam) {
      await handleUpdateTeam(data as UpdateTeamData);
    } else {
      await handleCreateTeam(data as CreateTeamData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-2xl mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Teams Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage tournament teams
                </p>
              </div>
            </div>
            
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Team
              </button>
            )}
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

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <TeamForm
              team={editingTeam || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Teams List */}
        <TeamList
          teams={teams}
          onEdit={handleEditTeam}
          onDelete={handleDeleteTeam}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
