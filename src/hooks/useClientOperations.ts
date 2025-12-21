/**
 * Client Operations Hook
 *
 * High-level business logic for client operations
 * Combines queries, mutations, and UI state management
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useClients,
  useClient,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from './queries/useClients';
import { useClientStore } from '../stores/clientStore';
import { useUIStore } from '../stores/uiStore';
import type { CreateClientDTO, Client } from '../types/client';

export const useClientOperations = (facilityId?: string) => {
  const navigate = useNavigate();
  const { showActionLoader, hideActionLoader } = useUIStore();
  const { setSelectedClient, setShow } = useClientStore();

  // Queries
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  /**
   * Create a new client
   */
  const createClient = useCallback(
    async (data: CreateClientDTO) => {
      showActionLoader('Creating client...');
      try {
        const newClient = await createMutation.mutateAsync({
          ...data,
          facility: facilityId!,
        });
        setSelectedClient(newClient);
        return newClient;
      } catch (error) {
        console.error('Failed to create client:', error);
        throw error;
      } finally {
        hideActionLoader();
      }
    },
    [
      createMutation,
      facilityId,
      showActionLoader,
      hideActionLoader,
      setSelectedClient,
    ],
  );

  /**
   * Update an existing client
   */
  const updateClient = useCallback(
    async (clientId: string, data: Partial<Client>) => {
      showActionLoader('Updating client...');
      try {
        const updatedClient = await updateMutation.mutateAsync({
          id: clientId,
          data,
        });
        setSelectedClient(updatedClient);
        return updatedClient;
      } catch (error) {
        console.error('Failed to update client:', error);
        throw error;
      } finally {
        hideActionLoader();
      }
    },
    [updateMutation, showActionLoader, hideActionLoader, setSelectedClient],
  );

  /**
   * Delete a client with confirmation
   */
  const deleteClient = useCallback(
    async (clientId: string, clientName: string) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${clientName}? This action cannot be undone.`,
      );

      if (!confirmed) return false;

      showActionLoader('Deleting client...');
      try {
        await deleteMutation.mutateAsync(clientId);
        setShow('list');
        return true;
      } catch (error) {
        console.error('Failed to delete client:', error);
        throw error;
      } finally {
        hideActionLoader();
      }
    },
    [deleteMutation, showActionLoader, hideActionLoader, setShow],
  );

  /**
   * View client details
   */
  const viewClient = useCallback(
    (client: Client) => {
      setSelectedClient(client);
      navigate(`/app/clients/detail/${client._id}`);
    },
    [setSelectedClient, navigate],
  );

  /**
   * Navigate to create client form
   */
  const goToCreateClient = useCallback(() => {
    setShow('create');
    navigate('/app/clients/create');
  }, [setShow, navigate]);

  /**
   * Navigate to client list
   */
  const goToClientList = useCallback(() => {
    setShow('list');
    navigate('/app/clients');
  }, [setShow, navigate]);

  return {
    // Operations
    createClient,
    updateClient,
    deleteClient,
    viewClient,
    goToCreateClient,
    goToClientList,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Error states
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
