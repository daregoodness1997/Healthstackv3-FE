/**
 * Organization/Facility Query Hooks
 *
 * TanStack Query hooks for Organization CRUD operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import client from '../../feathers';
import { queryKeys } from '../../lib/queryClient';

const facilityService = client.service('facility');

export interface Organization {
  _id: string;
  facilityName: string;
  facilityType?: string;
  facilityOwner?: string;
  facilityAddress?: string;
  facilityContactPhone?: string;
  facilityEmail?: string;
  facilityWebsite?: string;
  facilityLogo?: string;
  facilityCity?: string;
  facilityState?: string;
  facilityCountry?: string;
  modules?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface OrganizationQueryParams {
  search?: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  facilityType?: string;
}

/**
 * Fetch paginated list of organizations
 */
export const useOrganizations = (params: OrganizationQueryParams) => {
  return useQuery({
    queryKey: ['organizations', params],
    queryFn: async (): Promise<{ data: Organization[]; total: number }> => {
      const query: any = {
        $limit: params.limit || 50,
        $skip: params.skip || 0,
        $sort: {
          [params.sortBy || 'createdAt']: params.sortOrder === 'asc' ? 1 : -1,
        },
      };

      if (params.search) {
        query.$or = [
          { facilityName: { $regex: params.search, $options: 'i' } },
          { facilityEmail: { $regex: params.search, $options: 'i' } },
          { facilityContactPhone: { $regex: params.search, $options: 'i' } },
          { facilityCity: { $regex: params.search, $options: 'i' } },
        ];
      }

      if (params.facilityType) {
        query.facilityType = params.facilityType;
      }

      const response = await facilityService.find({ query });
      return { data: response.data, total: response.total };
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch single organization by ID
 */
export const useOrganization = (organizationId: string | undefined) => {
  return useQuery({
    queryKey: ['organizations', organizationId],
    queryFn: async (): Promise<Organization> => {
      if (!organizationId) throw new Error('Organization ID is required');
      return await facilityService.get(organizationId);
    },
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Prefetch organization for hover optimization
 */
export const usePrefetchOrganization = () => {
  const queryClient = useQueryClient();

  return (organizationId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['organizations', organizationId],
      queryFn: () => facilityService.get(organizationId),
      staleTime: 1000 * 60 * 10,
    });
  };
};

/**
 * Create new organization mutation
 */
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Organization>) => {
      return await facilityService.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success(`Organization ${data.facilityName} created successfully`);
    },
    onError: (error: any) => {
      toast.error(`Failed to create organization: ${error.message}`);
    },
  });
};

/**
 * Update organization mutation
 */
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Organization>;
    }) => {
      return await facilityService.patch(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({
        queryKey: ['organizations', variables.id],
      });
      toast.success(`Organization ${data.facilityName} updated successfully`);
    },
    onError: (error: any) => {
      toast.error(`Failed to update organization: ${error.message}`);
    },
  });
};

/**
 * Delete organization mutation
 */
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (organizationId: string) => {
      return await facilityService.remove(organizationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete organization: ${error.message}`);
    },
  });
};
