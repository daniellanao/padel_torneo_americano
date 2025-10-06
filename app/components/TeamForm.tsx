'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Team, CreateTeamData, UpdateTeamData } from '@/types/team';
import { TeamService } from '@/lib/teams';

interface TeamFormProps {
  team?: Team;
  onSubmit: (data: CreateTeamData | UpdateTeamData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function TeamForm({ team, onSubmit, onCancel, isLoading }: TeamFormProps) {
  const [formData, setFormData] = useState({
    player1_id: team?.player1_id || 0,
    player2_id: team?.player2_id || 0,
  });
  const [errors, setErrors] = useState<{ player1_id?: string; player2_id?: string }>({});
  const [players, setPlayers] = useState<{ id: number; name: string }[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  // Load players on component mount
  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoadingPlayers(true);
      const playersData = await TeamService.getPlayers();
      setPlayers(playersData);
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const validateForm = () => {
    const newErrors: { player1_id?: string; player2_id?: string } = {};
    
    if (!formData.player1_id) {
      newErrors.player1_id = 'Player 1 is required';
    }
    
    if (!formData.player2_id) {
      newErrors.player2_id = 'Player 2 is required';
    }
    
    if (formData.player1_id && formData.player2_id && formData.player1_id === formData.player2_id) {
      newErrors.player2_id = 'Player 2 must be different from Player 1';
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
      setFormData({ player1_id: 0, player2_id: 0 });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    
    // Clear error when user makes a selection
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faUsers} className="text-blue-600 mr-2" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {team ? 'Edit Team' : 'Add New Team'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="player1_id" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Player 1
            </label>
            <select
              id="player1_id"
              name="player1_id"
              value={formData.player1_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.player1_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isLoading || loadingPlayers}
            >
              <option value={0}>Select Player 1</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            {errors.player1_id && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.player1_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="player2_id" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Player 2
            </label>
            <select
              id="player2_id"
              name="player2_id"
              value={formData.player2_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.player2_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              disabled={isLoading || loadingPlayers}
            >
              <option value={0}>Select Player 2</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            {errors.player2_id && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.player2_id}</p>
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
            disabled={isLoading || loadingPlayers}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {isLoading ? 'Saving...' : (team ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
}
