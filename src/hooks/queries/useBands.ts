/**
 * Band Query Hooks
 *
 * TanStack Query hooks for Band CRUD operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import client from '../../feathers';
import { queryKeys } from '../../lib/queryClient';

const bandService = client.service('bands');

export interface Band {
  _id: string;
  name?: string;
  bandType?: string;
  bandLevel?: string;
  description?: string;
  facility: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BandQueryParams {
  facilityId?: string;
  search?: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch paginated list of bands
 */
export const useBands = (params: BandQueryParams) => {
  return useQuery({
    queryKey: ['bands', params],
    queryFn: async (): Promise<{ data: Band[]; total: number }> => {
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
          { bandType: { $regex: params.search, $options: 'i' } },
          { bandLevel: { $regex: params.search, $options: 'i' } },
          { description: { $regex: params.search, $options: 'i' } },
        ];
      }

      const response = await bandService.find({ query });
      return { data: response.data, total: response.total };
    },
    enabled: !!params.facilityId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch single band by ID
 */
export const useBand = (bandId: string | undefined) => {
  return useQuery({
    queryKey: ['bands', bandId],
    queryFn: async (): Promise<Band> => {
      if (!bandId) throw new Error('Band ID is required');
      return await bandService.get(bandId);
    },
    enabled: !!bandId,
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Prefetch band for hover optimization
 */
export const usePrefetchBand = () => {
  const queryClient = useQueryClient();

  return (bandId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['bands', bandId],
      queryFn: () => bandService.get(bandId),
      staleTime: 1000 * 60 * 10,
    });
  };
};

/**
 * Create new band mutation
 */
export const useCreateBand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Band>) => {
      return await bandService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bands'] });
      toast.success('Band created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create band: ${error.message}`);
    },
  });
};

/**
 * Update band mutation
 */
export const useUpdateBand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Band> }) => {
      return await bandService.patch(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bands'] });
      queryClient.invalidateQueries({ queryKey: ['bands', variables.id] });
      toast.success('Band updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update band: ${error.message}`);
    },
  });
};

/**
 * Delete band mutation
 */
export const useDeleteBand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bandId: string) => {
      return await bandService.remove(bandId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bands'] });
      toast.success('Band deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete band: ${error.message}`);
    },
  });
};
