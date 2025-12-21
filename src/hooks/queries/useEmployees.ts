/**
 * Employee Query Hooks
 *
 * TanStack Query hooks for Employee CRUD operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import client from '../../feathers';
import { queryKeys } from '../../lib/queryClient';

const employeeService = client.service('employee');

export interface Employee {
  _id: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  profession?: string;
  department?: string;
  band?: string;
  facility: string;
  imageurl?: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface EmployeeQueryParams {
  facilityId?: string;
  search?: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  department?: string;
  profession?: string;
}

/**
 * Fetch paginated list of employees
 */
export const useEmployees = (params: EmployeeQueryParams) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: async (): Promise<{ data: Employee[]; total: number }> => {
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
          { firstname: { $regex: params.search, $options: 'i' } },
          { lastname: { $regex: params.search, $options: 'i' } },
          { email: { $regex: params.search, $options: 'i' } },
          { phone: { $regex: params.search, $options: 'i' } },
          { profession: { $regex: params.search, $options: 'i' } },
        ];
      }

      if (params.department) {
        query.department = params.department;
      }

      if (params.profession) {
        query.profession = params.profession;
      }

      const response = await employeeService.find({ query });
      return { data: response.data, total: response.total };
    },
    enabled: !!params.facilityId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch single employee by ID
 */
export const useEmployee = (employeeId: string | undefined) => {
  return useQuery({
    queryKey: ['employees', employeeId],
    queryFn: async (): Promise<Employee> => {
      if (!employeeId) throw new Error('Employee ID is required');
      return await employeeService.get(employeeId);
    },
    enabled: !!employeeId,
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Prefetch employee for hover optimization
 */
export const usePrefetchEmployee = () => {
  const queryClient = useQueryClient();

  return (employeeId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['employees', employeeId],
      queryFn: () => employeeService.get(employeeId),
      staleTime: 1000 * 60 * 10,
    });
  };
};

/**
 * Create new employee mutation
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Employee>) => {
      return await employeeService.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success(
        `Employee ${data.firstname} ${data.lastname} created successfully`,
      );
    },
    onError: (error: any) => {
      toast.error(`Failed to create employee: ${error.message}`);
    },
  });
};

/**
 * Update employee mutation
 */
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Employee>;
    }) => {
      return await employeeService.patch(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees', variables.id] });
      toast.success(
        `Employee ${data.firstname} ${data.lastname} updated successfully`,
      );
    },
    onError: (error: any) => {
      toast.error(`Failed to update employee: ${error.message}`);
    },
  });
};

/**
 * Delete employee mutation
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: string) => {
      return await employeeService.remove(employeeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete employee: ${error.message}`);
    },
  });
};
