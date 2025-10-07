'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faSave, faTimes, faSpinner, faCheckCircle, faTrophy, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Final } from '@/types/final';
import { updateFinal, deleteFinal } from '@/lib/finals';

interface FinalCardProps {
  final: Final;
  onFinalUpdated: () => void;
}

export default function FinalCard({ final, onFinalUpdated }: FinalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [team1Score, setTeam1Score] = useState(final.team1_score ?? 0);
  const [team2Score, setTeam2Score] = useState(final.team2_score ?? 0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTeamName = (team: Final['team1'] | Final['team2']) => {
    if (team?.player1?.name && team?.player2?.name) {
      return `${team.player1.name} & ${team.player2.name}`;
    }
    return `Team ${team?.id}`;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quarter': return 'Quarter Final';
      case 'semis': return 'Semi Final';
      case 'final': return 'Final';
      default: return type;
    }
  };

  const handleSaveScore = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Validation
      if (team1Score < 0 || team2Score < 0) {
        setError('Scores cannot be negative');
        return;
      }

      if (team1Score === team2Score) {
        setError('Scores cannot be equal - there must be a winner');
        return;
      }

      if (team1Score < 6 && team2Score < 6) {
        setError('At least one team must reach 6 games to win');
        return;
      }

      const winnerId = team1Score > team2Score ? final.team1_id : final.team2_id;

      await updateFinal(final.id, {
        team1_score: team1Score,
        team2_score: team2Score,
        team_winner_id: winnerId
      });

      setIsEditing(false);
      onFinalUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save score');
      console.error('Error saving score:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTeam1Score(final.team1_score ?? 0);
    setTeam2Score(final.team2_score ?? 0);
    setError(null);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this final match?')) {
      try {
        await deleteFinal(final.id);
        onFinalUpdated();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete final');
        console.error('Error deleting final:', err);
      }
    }
  };

  const isCompleted = final.team1_score !== null && final.team2_score !== null;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 transition-colors ${
      isCompleted 
        ? 'border-green-200 dark:border-green-800' 
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      {/* Final Type */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {getTypeLabel(final.type)}
        </span>
        {isCompleted && (
          <div className="flex items-center text-xs text-green-600 dark:text-green-400">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
            Completed
          </div>
        )}
        {!isCompleted && (
          <span className="text-xs text-gray-500 dark:text-gray-400">Pending</span>
        )}
      </div>

      {/* Teams and Scores */}
      <div className="space-y-2">
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <FontAwesomeIcon icon={faUsers} className="text-blue-600 mr-2 text-xs" />
            <span className={`text-sm font-medium ${
              isCompleted && final.team_winner_id === final.team1_id
                ? 'text-green-600 dark:text-green-400 font-bold'
                : 'text-gray-900 dark:text-white'
            }`}>
              {getTeamName(final.team1)}
              {isCompleted && final.team_winner_id === final.team1_id && (
                <FontAwesomeIcon icon={faTrophy} className="ml-2 text-yellow-500" />
              )}
            </span>
          </div>
          {isEditing ? (
            <input
              type="number"
              min="0"
              max="7"
              value={team1Score}
              onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <span className="text-lg font-bold text-gray-900 dark:text-white w-16 text-center">
              {final.team1_score ?? '-'}
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <FontAwesomeIcon icon={faUsers} className="text-blue-600 mr-2 text-xs" />
            <span className={`text-sm font-medium ${
              isCompleted && final.team_winner_id === final.team2_id
                ? 'text-green-600 dark:text-green-400 font-bold'
                : 'text-gray-900 dark:text-white'
            }`}>
              {getTeamName(final.team2)}
              {isCompleted && final.team_winner_id === final.team2_id && (
                <FontAwesomeIcon icon={faTrophy} className="ml-2 text-yellow-500" />
              )}
            </span>
          </div>
          {isEditing ? (
            <input
              type="number"
              min="0"
              max="7"
              value={team2Score}
              onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <span className="text-lg font-bold text-gray-900 dark:text-white w-16 text-center">
              {final.team2_score ?? '-'}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-1" />
          Delete
        </button>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSaveScore}
                disabled={isSaving}
                className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-1" />
                    Save Score
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-1" />
              {isCompleted ? 'Edit Score' : 'Enter Score'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
