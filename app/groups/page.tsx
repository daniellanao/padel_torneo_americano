'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faLayerGroup, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Group, CreateGroupData, UpdateGroupData } from '@/types/group';
import { GroupService } from '@/lib/groups';
import GroupForm from '@/app/components/GroupForm';
import GroupList from '@/app/components/GroupList';

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load groups on component mount
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const groupsData = await GroupService.getGroups();
      setGroups(groupsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups');
      console.error('Error loading groups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async (data: CreateGroupData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const newGroup = await GroupService.createGroup(data);
      setGroups(prev => [...prev, newGroup]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
      console.error('Error creating group:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGroup = async (data: UpdateGroupData) => {
    if (!editingGroup) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const updatedGroup = await GroupService.updateGroup(editingGroup.id, data);
      setGroups(prev => 
        prev.map(group => 
          group.id === editingGroup.id ? updatedGroup : group
        )
      );
      setEditingGroup(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update group');
      console.error('Error updating group:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    try {
      setError(null);
      await GroupService.deleteGroup(id);
      setGroups(prev => prev.filter(group => group.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete group');
      console.error('Error deleting group:', err);
    }
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingGroup(null);
  };

  const handleFormSubmit = async (data: CreateGroupData | UpdateGroupData) => {
    if (editingGroup) {
      await handleUpdateGroup(data as UpdateGroupData);
    } else {
      await handleCreateGroup(data as CreateGroupData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 text-2xl mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Groups Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage tournament groups
                </p>
              </div>
            </div>
            
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Group
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
            <GroupForm
              group={editingGroup || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Groups List */}
        <GroupList
          groups={groups}
          onEdit={handleEditGroup}
          onDelete={handleDeleteGroup}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
