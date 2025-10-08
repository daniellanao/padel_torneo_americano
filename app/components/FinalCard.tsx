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
    return `Equipo ${team?.id}`;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quarter': return 'Cuarto de Final';
      case 'semis': return 'Semifinal';
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
        setError('Las puntuaciones no pueden ser negativas');
        return;
      }

      if (team1Score === team2Score) {
        setError('Las puntuaciones no pueden ser iguales - debe haber un ganador');
        return;
      }

      if (team1Score < 6 && team2Score < 6) {
        setError('Al menos un equipo debe llegar a 6 juegos para ganar');
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
      setError(err instanceof Error ? err.message : 'Error al guardar puntuación');
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
    if (window.confirm('¿Estás seguro de que quieres eliminar este partido final?')) {
      try {
        await deleteFinal(final.id);
        onFinalUpdated();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar final');
        console.error('Error deleting final:', err);
      }
    }
  };

  const isCompleted = final.team1_score !== null && final.team2_score !== null;

  return (
    <div className={`bg-gray-800 rounded-lg shadow-md p-4 border-2 transition-colors ${
      isCompleted 
        ? 'border-green-800' 
        : 'border-gray-700'
    }`}>
      {/* Final Type */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400">
          {getTypeLabel(final.type)}
        </span>
        {isCompleted && (
          <div className="flex items-center text-xs text-green-400">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
            Completado
          </div>
        )}
        {!isCompleted && (
          <span className="text-xs text-gray-400">Pendiente</span>
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
                ? 'text-green-400 font-bold'
                : 'text-white'
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
              className="w-16 px-2 py-1 text-sm text-center border border-gray-600 rounded bg-gray-700 text-white"
            />
          ) : (
            <span className="text-lg font-bold text-white w-16 text-center">
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
                ? 'text-green-400 font-bold'
                : 'text-white'
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
              className="w-16 px-2 py-1 text-sm text-center border border-gray-600 rounded bg-gray-700 text-white"
            />
          ) : (
            <span className="text-lg font-bold text-white w-16 text-center">
              {final.team2_score ?? '-'}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 text-xs text-red-400 bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-1" />
          Eliminar
        </button>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-1" />
                Cancelar
              </button>
              <button
                onClick={handleSaveScore}
                disabled={isSaving}
                className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-1" />
                    Guardar Puntuación
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
              {isCompleted ? 'Editar Puntuación' : 'Ingresar Puntuación'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
