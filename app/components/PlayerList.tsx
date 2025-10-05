'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Player } from '@/types/player';

interface PlayerListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function PlayerList({ players, onEdit, onDelete, isLoading }: PlayerListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };


  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center py-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            No Players Found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Start by adding your first player to the tournament.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Players ({players.length})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {players.map((player) => (
          <div key={player.id} className="px-6 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {player.name}
                </h4>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(player)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                  title="Edit player"
                >
                  <FontAwesomeIcon icon={faEdit} className="text-sm" />
                </button>
                <button
                  onClick={() => handleDelete(player.id)}
                  className={`p-2 rounded-md transition-colors ${
                    deleteConfirm === player.id
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                  title={deleteConfirm === player.id ? 'Click again to confirm' : 'Delete player'}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
