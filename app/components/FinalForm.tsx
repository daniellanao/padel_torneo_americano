'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Final, CreateFinalData, UpdateFinalData } from '@/types/final';
import { Team } from '@/types/team';
import { TeamService } from '@/lib/teams';

interface FinalFormProps {
  final?: Final;
  onSubmit: (data: CreateFinalData | UpdateFinalData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function FinalForm({ final, onSubmit, onCancel, isLoading }: FinalFormProps) {
  const [formData, setFormData] = useState({
    team1_id: final?.team1_id || 0,
    team2_id: final?.team2_id || 0,
    type: final?.type || 'quarter' as 'quarter' | 'semis' | 'final',
  });
  const [errors, setErrors] = useState<{ team1_id?: string; team2_id?: string; type?: string }>({});
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // Load teams on component mount
  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoadingTeams(true);
      const teamsData = await TeamService.getTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const validateForm = () => {
    const newErrors: { team1_id?: string; team2_id?: string; type?: string } = {};
    
    if (!formData.team1_id) {
      newErrors.team1_id = 'Team 1 is required';
    }
    
    if (!formData.team2_id) {
      newErrors.team2_id = 'Team 2 is required';
    }
    
    if (formData.team1_id && formData.team2_id && formData.team1_id === formData.team2_id) {
      newErrors.team2_id = 'Team 2 must be different from Team 1';
    }

    if (!formData.type) {
      newErrors.type = 'Final type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ team1_id: 0, team2_id: 0, type: 'quarter' });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'type' ? value : parseInt(value) 
    }));
    
    // Clear error when user makes a selection
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const getTeamName = (team: Team) => {
    if (team.player1?.name && team.player2?.name) {
      return `${team.player1.name} & ${team.player2.name}`;
    }
    return `Team ${team.id}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faTrophy} className="text-blue-600 mr-2" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {final ? 'Edit Final Match' : 'Add New Final Match'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="type" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Final Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.type ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isLoading}
            >
              <option value="quarter">Quarter Final</option>
              <option value="semis">Semi Final</option>
              <option value="final">Final</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.type}</p>
            )}
          </div>

          <div>
            <label htmlFor="team1_id" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team 1
            </label>
            <select
              id="team1_id"
              name="team1_id"
              value={formData.team1_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.team1_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isLoading || loadingTeams}
            >
              <option value={0}>Select Team 1</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {getTeamName(team)}
                </option>
              ))}
            </select>
            {errors.team1_id && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.team1_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="team2_id" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team 2
            </label>
            <select
              id="team2_id"
              name="team2_id"
              value={formData.team2_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.team2_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isLoading || loadingTeams}
            >
              <option value={0}>Select Team 2</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {getTeamName(team)}
                </option>
              ))}
            </select>
            {errors.team2_id && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.team2_id}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-2 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading || loadingTeams}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {isLoading ? 'Saving...' : (final ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
}
