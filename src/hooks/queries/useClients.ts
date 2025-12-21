/**
 * Client Query Hooks
 *
 * TanStack Query hooks for Client CRUD operations
 * Provides automatic caching, refetching, and optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import client from '../../feathers';
import { Models } from '../../hsmodules/app/Constants';
import { queryKeys } from '../../lib/queryClient';
import type {
  Client,
  CreateClientDTO,
  UpdateClientDTO,
  ClientQueryParams,
  ClientListResponse,
} from '../../types/client';

const clientService = client.service(Models.CLIENT);

/**
 * Fetch paginated list of clients
 *
 * Features:
 * - Automatic caching (5 min stale time)
 * - Search by name, phone, email
 * - Pagination support
 * - Sorting
 *
 * @param params - Query parameters (facilityId, search, pagination, etc.)
 * @returns Query result with clients data
 */
export const useClients = (params: ClientQueryParams) => {
  return useQuery({
    queryKey: queryKeys.clients.list(params),
    queryFn: async (): Promise<{ data: Client[]; total: number }> => {
      const query: any = {
        facility: params.facilityId,
        $limit: params.limit || 50,
        $skip: params.skip || 0,
        $sort: {
          [params.sortBy || 'createdAt']: params.sortOrder === 'asc' ? 1 : -1,
        },
      };

      // Add search filters
      if (params.search) {
        query.$or = [
          { firstname: { $regex: params.search, $options: 'i' } },
          { lastname: { $regex: params.search, $options: 'i' } },
          { phone: { $regex: params.search, $options: 'i' } },
          { email: { $regex: params.search, $options: 'i' } },
          { mrn: { $regex: params.search, $options: 'i' } },
        ];
      }

      // Add gender filter
      if (params.gender) {
        query.gender = params.gender;
      }

      // Add status filter if provided
      if (params.status) {
        query.status = params.status;
      }

      const response = await clientService.find({ query });
      return { data: response.data, total: response.total };
    },
    enabled: !!params.facilityId, // Only fetch if facilityId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetch single client by ID
 *
 * @param clientId - Client ID
 * @returns Query result with client data
 */
export const useClient = (clientId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.clients.detail(clientId || ''),
    queryFn: async (): Promise<Client> => {
      if (!clientId) throw new Error('Client ID is required');
      return await clientService.get(clientId);
    },
    enabled: !!clientId,
    staleTime: 1000 * 60 * 10, // 10 minutes for individual records
  });
};

/**
 * Create new client mutation
 *
 * Features:
 * - Automatic list invalidation
 * - Success/error toasts
 * - Loading states
 *
 * @returns Mutation object with mutate, mutateAsync functions
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClientDTO): Promise<Client> => {
      return await clientService.create(data);
    },
    onSuccess: (newClient) => {
      // Invalidate all client list queries to show new client
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });

      // Optionally set the new client in cache
      queryClient.setQueryData(
        queryKeys.clients.detail(newClient._id),
        newClient,
      );

      toast.success('Client created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating client:', error);
      toast.error(`Error creating client: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Update existing client mutation
 *
 * Features:
 * - Optimistic updates
 * - Automatic rollback on error
 * - Cache invalidation
 *
 * @returns Mutation object with mutate, mutateAsync functions
 */
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Client>;
    }): Promise<Client> => {
      return await clientService.patch(id, data);
    },
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.clients.detail(id),
      });

      // Snapshot the previous value
      const previousClient = queryClient.getQueryData<Client>(
        queryKeys.clients.detail(id),
      );

      // Optimistically update the cache
      if (previousClient) {
        queryClient.setQueryData<Client>(queryKeys.clients.detail(id), {
          ...previousClient,
          ...data,
        });
      }

      // Return context with snapshot
      return { previousClient };
    },
    onError: (error: any, { id }, context) => {
      // Rollback to previous value on error
      if (context?.previousClient) {
        queryClient.setQueryData(
          queryKeys.clients.detail(id),
          context.previousClient,
        );
      }
      console.error('Error updating client:', error);
      toast.error(`Error updating client: ${error.message || 'Unknown error'}`);
    },
    onSuccess: (updatedClient, { id }) => {
      // Update cache with server response
      queryClient.setQueryData(queryKeys.clients.detail(id), updatedClient);

      // Invalidate list queries to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });

      toast.success('Client updated successfully');
    },
  });
};

/**
 * Delete client mutation
 *
 * Features:
 * - Automatic cache cleanup
 * - List invalidation
 *
 * @returns Mutation object with mutate, mutateAsync functions
 */
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string): Promise<Client> => {
      return await clientService.remove(clientId);
    },
    onSuccess: (deletedClient) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.clients.detail(deletedClient._id),
      });

      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });

      toast.success('Client deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting client:', error);
      toast.error(`Error deleting client: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Prefetch client data
 * Useful for hovering over list items to preload detail view
 *
 * @param clientId - Client ID to prefetch
 */
export const usePrefetchClient = () => {
  const queryClient = useQueryClient();

  return (clientId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.clients.detail(clientId),
      queryFn: async () => await clientService.get(clientId),
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  };
};
