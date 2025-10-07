'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faPlay, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { StandingService } from '@/lib/standings';
import { MatchService } from '@/lib/matches';

export default function GroupStagePage() {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if tournament is already initialized
  useEffect(() => {
    checkTournamentStatus();
  }, []);

  const checkTournamentStatus = async () => {
    try {
      setIsChecking(true);
      const initialized = await StandingService.isTournamentInitialized();
      setIsInitialized(initialized);
    } catch (err) {
      console.error('Error checking tournament status:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleStartTournament = async () => {
    try {
      setIsStarting(true);
      setError(null);
      setSuccess(null);
      
      // Initialize tournament standings
      const standingsResult = await StandingService.initializeTournamentStandings();
      
      // Generate round-robin matches for all groups
      const matchesResult = await MatchService.generateRoundRobinMatches();
      
      setSuccess(`Tournament started successfully! Created standings for ${standingsResult.created} teams and ${matchesResult.created} matches.`);
      setIsInitialized(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tournament');
      console.error('Error starting tournament:', err);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faTable} className="text-blue-600 text-2xl mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Group Stage
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tournament group stage management
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-xs font-medium text-green-800 dark:text-green-200">
                  Success
                </h3>
                <div className="mt-2 text-xs text-green-700 dark:text-green-300">
                  {success}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setSuccess(null)}
                    className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-md hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faTable} className="text-blue-600 dark:text-blue-400 text-4xl" />
            </div>
            
            {isChecking ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Loading...
                </h2>
                <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-2xl animate-spin" />
              </>
            ) : isInitialized ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Tournament Already Started
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
                  The tournament has been initialized and standings have been created for all teams.
                </p>
                <div className="inline-flex items-center px-6 py-3 border border-green-500 text-sm font-medium rounded-md text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  Tournament Active
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Ready to Start the Tournament?
                </h2>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
                  Click the button below to begin the group stage. Make sure all teams are assigned to groups before starting.
                </p>

                <button
                  onClick={handleStartTournament}
                  disabled={isStarting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStarting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPlay} className="mr-2" />
                      Start Tournament
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faTable} className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-xs font-medium text-blue-800 dark:text-blue-200">
                Before Starting
              </h3>
              <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                <p>• Ensure all players are created</p>
                <p>• Verify all teams are formed</p>
                <p>• Confirm all groups are set up</p>
                <p>• Check that teams are assigned to groups</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
