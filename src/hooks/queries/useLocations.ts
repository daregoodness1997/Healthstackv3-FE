/**
 * Location Query Hooks
 *
 * TanStack Query hooks for Location CRUD operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import client from '../../feathers';
import { queryKeys } from '../../lib/queryClient';

const locationService = client.service('location');

export interface Location {
  _id: string;
  name: string;
  locationType: string;
  branch?: string;
  facility: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LocationQueryParams {
  facilityId?: string;
  search?: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  locationType?: string;
}

/**
 * Fetch paginated list of locations
 */
export const useLocations = (params: LocationQueryParams) => {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: async (): Promise<{ data: Location[]; total: number }> => {
      const query: any = {
        facility: params.facilityId,
        $limit: params.limit || 50,
        $skip: params.skip || 0,
        $sort: {
          [params.sortBy || 'createdAt']: params.sortOrder === 'asc' ? 1 : -1,
        },
      };

      if (params.search) {
        query.$or = [
          { name: { $regex: params.search, $options: 'i' } },
          { locationType: { $regex: params.search, $options: 'i' } },
          { branch: { $regex: params.search, $options: 'i' } },
        ];
      }

      if (params.locationType) {
        query.locationType = params.locationType;
      }

      const response = await locationService.find({ query });
      return { data: response.data, total: response.total };
    },
    enabled: !!params.facilityId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch single location by ID
 */
export const useLocation = (locationId: string | undefined) => {
  return useQuery({
    queryKey: ['locations', locationId],
    queryFn: async (): Promise<Location> => {
      if (!locationId) throw new Error('Location ID is required');
      return await locationService.get(locationId);
    },
    enabled: !!locationId,
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Prefetch location for hover optimization
 */
export const usePrefetchLocation = () => {
  const queryClient = useQueryClient();

  return (locationId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['locations', locationId],
      queryFn: () => locationService.get(locationId),
      staleTime: 1000 * 60 * 10,
    });
  };
};

/**
 * Create new location mutation
 */
export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Location>) => {
      return await locationService.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success(`Location ${data.name} created successfully`);
    },
    onError: (error: any) => {
      toast.error(`Failed to create location: ${error.message}`);
    },
  });
};

/**
 * Update location mutation
 */
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Location>;
    }) => {
      return await locationService.patch(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['locations', variables.id] });
      toast.success(`Location ${data.name} updated successfully`);
    },
    onError: (error: any) => {
      toast.error(`Failed to update location: ${error.message}`);
    },
  });
};

/**
 * Delete location mutation
 */
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locationId: string) => {
      return await locationService.remove(locationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete location: ${error.message}`);
    },
  });
};
