import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
// @ts-ignore - JS module
import client from '../../feathers';

/**
 * Custom hooks for Laboratory Reference Values
 * Uses labrefvalue service
 */

export interface LabRefValue {
  _id?: string;
  testname: string;
  testclass: string;
  facilityId: string;
  tests: Array<{
    test: string;
    texttype: boolean;
    normalValues: Array<{
      unitMeasure: string;
      upperLimit: string;
      lowerLimit: string;
    }>;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface UseLabRefValuesParams {
  facilityId?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

/**
 * Hook to fetch laboratory reference values
 */
export function useLabRefValues(params: UseLabRefValuesParams) {
  const { facilityId, search, limit = 20, skip = 0 } = params;

  return useQuery({
    queryKey: ['lab-ref-values', facilityId, search, limit, skip],
    queryFn: async () => {
      const labRefService = client.service('labrefvalue');

      const query: any = {
        facilityId: facilityId || '',
        $limit: limit,
        $skip: skip,
        $sort: { createdAt: -1 },
      };

      // Add search filter if provided
      if (search) {
        query.$or = [
          {
            testname: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            testclass: {
              $regex: search,
              $options: 'i',
            },
          },
        ];
      }

      return await labRefService.find({ query });
    },
    enabled: !!facilityId,
    staleTime: 5 * 60 * 1000, // 5 minutes - reference values don't change often
  });
}

/**
 * Hook to get a single lab reference value
 */
export function useLabRefValue(id: string) {
  return useQuery({
    queryKey: ['lab-ref-value', id],
    queryFn: async () => {
      const labRefService = client.service('labrefvalue');
      return await labRefService.get(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a lab reference value
 */
export function useCreateLabRefValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<LabRefValue, '_id'>) => {
      const labRefService = client.service('labrefvalue');
      return await labRefService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-ref-values'] });
      toast.success('Lab reference value created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create lab reference value: ${error.message}`);
    },
  });
}

/**
 * Hook to update a lab reference value
 */
export function useUpdateLabRefValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<LabRefValue>;
    }) => {
      const labRefService = client.service('labrefvalue');
      return await labRefService.patch(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['lab-ref-value', variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ['lab-ref-values'] });
      toast.success('Lab reference value updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update lab reference value: ${error.message}`);
    },
  });
}

/**
 * Hook to delete a lab reference value
 */
export function useDeleteLabRefValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const labRefService = client.service('labrefvalue');
      return await labRefService.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-ref-values'] });
      toast.success('Lab reference value deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete lab reference value: ${error.message}`);
    },
  });
}
