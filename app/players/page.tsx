'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUsers, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Player, CreatePlayerData, UpdatePlayerData } from '@/types/player';
import { PlayerService } from '@/lib/players';
import PlayerForm from '@/app/components/PlayerForm';
import PlayerList from '@/app/components/PlayerList';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load players on component mount
  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const playersData = await PlayerService.getPlayers();
      setPlayers(playersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load players');
      console.error('Error loading players:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlayer = async (data: CreatePlayerData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const newPlayer = await PlayerService.createPlayer(data);
      setPlayers(prev => [newPlayer, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create player');
      console.error('Error creating player:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePlayer = async (data: UpdatePlayerData) => {
    if (!editingPlayer) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const updatedPlayer = await PlayerService.updatePlayer(editingPlayer.id, data);
      setPlayers(prev => 
        prev.map(player => 
          player.id === editingPlayer.id ? updatedPlayer : player
        )
      );
      setEditingPlayer(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update player');
      console.error('Error updating player:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlayer = async (id: string) => {
    try {
      setError(null);
      await PlayerService.deletePlayer(id);
      setPlayers(prev => prev.filter(player => player.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete player');
      console.error('Error deleting player:', err);
    }
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPlayer(null);
  };

  const handleFormSubmit = async (data: CreatePlayerData | UpdatePlayerData) => {
    if (editingPlayer) {
      await handleUpdatePlayer(data as UpdatePlayerData);
    } else {
      await handleCreatePlayer(data as CreatePlayerData);
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
                  Players Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage tournament players
                </p>
              </div>
            </div>
            
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Player
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
            <PlayerForm
              player={editingPlayer || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Players List */}
        <PlayerList
          players={players}
          onEdit={handleEditPlayer}
          onDelete={handleDeletePlayer}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
