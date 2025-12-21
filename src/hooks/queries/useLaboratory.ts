import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import laboratoryService, {
  Laboratory,
  LabResult,
  LabBill,
} from '../../services/laboratoryService';

/**
 * TanStack Query hooks for Laboratory module
 */

// Query Keys
export const laboratoryKeys = {
  all: ['laboratories'] as const,
  lists: () => [...laboratoryKeys.all, 'list'] as const,
  list: (filters: any) => [...laboratoryKeys.lists(), { filters }] as const,
  details: () => [...laboratoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...laboratoryKeys.details(), id] as const,
  results: {
    all: ['lab-results'] as const,
    lists: () => [...laboratoryKeys.results.all, 'list'] as const,
    list: (filters: any) =>
      [...laboratoryKeys.results.lists(), { filters }] as const,
    detail: (id: string) =>
      [...laboratoryKeys.results.all, 'detail', id] as const,
    byClient: (clientId: string) =>
      [...laboratoryKeys.results.all, 'client', clientId] as const,
  },
  bills: {
    all: ['lab-bills'] as const,
    lists: () => [...laboratoryKeys.bills.all, 'list'] as const,
    list: (filters: any) =>
      [...laboratoryKeys.bills.lists(), { filters }] as const,
    detail: (id: string) =>
      [...laboratoryKeys.bills.all, 'detail', id] as const,
    byClient: (clientId: string) =>
      [...laboratoryKeys.bills.all, 'client', clientId] as const,
    byLaboratory: (labId: string) =>
      [...laboratoryKeys.bills.all, 'laboratory', labId] as const,
  },
  orders: {
    all: ['lab-orders'] as const,
    list: (filters: any) =>
      [...laboratoryKeys.orders.all, { filters }] as const,
  },
  inventory: {
    all: ['lab-inventory'] as const,
    list: (labId: string, filters: any) =>
      [...laboratoryKeys.inventory.all, labId, { filters }] as const,
  },
};

/**
 * Laboratory Location Hooks
 */

// Get all laboratories for a facility
export function useLaboratories(facilityId: string, query = {}) {
  return useQuery({
    queryKey: laboratoryKeys.list({ facilityId, ...query }),
    queryFn: () =>
      laboratoryService.laboratory.getLaboratories(facilityId, query),
    enabled: !!facilityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single laboratory
export function useLaboratory(laboratoryId: string) {
  return useQuery({
    queryKey: laboratoryKeys.detail(laboratoryId),
    queryFn: () => laboratoryService.laboratory.getLaboratory(laboratoryId),
    enabled: !!laboratoryId,
    staleTime: 5 * 60 * 1000,
  });
}

// Create laboratory
export function useCreateLaboratory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Laboratory, '_id'>) =>
      laboratoryService.laboratory.createLaboratory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: laboratoryKeys.lists() });
      toast.success('Laboratory created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating laboratory: ${error.message}`);
    },
  });
}

// Update laboratory
export function useUpdateLaboratory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Laboratory> }) =>
      laboratoryService.laboratory.updateLaboratory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: laboratoryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: laboratoryKeys.lists() });
      toast.success('Laboratory updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating laboratory: ${error.message}`);
    },
  });
}

// Delete laboratory
export function useDeleteLaboratory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (laboratoryId: string) =>
      laboratoryService.laboratory.deleteLaboratory(laboratoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: laboratoryKeys.lists() });
      toast.success('Laboratory deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting laboratory: ${error.message}`);
    },
  });
}

/**
 * Lab Results Hooks
 */

// Get all lab results
export function useLabResults(query = {}) {
  return useQuery({
    queryKey: laboratoryKeys.results.list(query),
    queryFn: () => laboratoryService.results.getLabResults(query),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get lab results for specific client
export function useClientLabResults(clientId: string) {
  return useQuery({
    queryKey: laboratoryKeys.results.byClient(clientId),
    queryFn: () => laboratoryService.results.getClientLabResults(clientId),
    enabled: !!clientId,
    staleTime: 1 * 60 * 1000,
  });
}

// Get single lab result
export function useLabResult(resultId: string) {
  return useQuery({
    queryKey: laboratoryKeys.results.detail(resultId),
    queryFn: () => laboratoryService.results.getLabResult(resultId),
    enabled: !!resultId,
  });
}

// Create lab result
export function useCreateLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<LabResult, '_id'>) =>
      laboratoryService.results.createLabResult(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: laboratoryKeys.results.lists(),
      });
      toast.success('Lab result created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating lab result: ${error.message}`);
    },
  });
}

// Update lab result
export function useUpdateLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LabResult> }) =>
      laboratoryService.results.updateLabResult(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: laboratoryKeys.results.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: laboratoryKeys.results.lists(),
      });
      toast.success('Lab result updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating lab result: ${error.message}`);
    },
  });
}

// Delete lab result
export function useDeleteLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resultId: string) =>
      laboratoryService.results.deleteLabResult(resultId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: laboratoryKeys.results.lists(),
      });
      toast.success('Lab result deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting lab result: ${error.message}`);
    },
  });
}

/**
 * Lab Bills Hooks
 */

// Get all lab bills
export function useLabBills(query = {}) {
  return useQuery({
    queryKey: laboratoryKeys.bills.list(query),
    queryFn: () => laboratoryService.bills.getLabBills(query),
    staleTime: 1 * 60 * 1000,
  });
}

// Get bills for specific laboratory
export function useLaboratoryBills(laboratoryId: string, query = {}) {
  return useQuery({
    queryKey: laboratoryKeys.bills.byLaboratory(laboratoryId),
    queryFn: () =>
      laboratoryService.bills.getLaboratoryBills(laboratoryId, query),
    enabled: !!laboratoryId,
    staleTime: 1 * 60 * 1000,
  });
}

// Get bills for specific client
export function useClientLabBills(clientId: string) {
  return useQuery({
    queryKey: laboratoryKeys.bills.byClient(clientId),
    queryFn: () => laboratoryService.bills.getClientLabBills(clientId),
    enabled: !!clientId,
    staleTime: 1 * 60 * 1000,
  });
}

// Get single lab bill
export function useLabBill(billId: string) {
  return useQuery({
    queryKey: laboratoryKeys.bills.detail(billId),
    queryFn: () => laboratoryService.bills.getLabBill(billId),
    enabled: !!billId,
  });
}

// Create lab bill
export function useCreateLabBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<LabBill, '_id'>) =>
      laboratoryService.bills.createLabBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: laboratoryKeys.bills.lists() });
      toast.success('Lab bill created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating lab bill: ${error.message}`);
    },
  });
}

// Update lab bill
export function useUpdateLabBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LabBill> }) =>
      laboratoryService.bills.updateLabBill(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: laboratoryKeys.bills.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: laboratoryKeys.bills.lists() });
      toast.success('Lab bill updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating lab bill: ${error.message}`);
    },
  });
}

// Delete lab bill
export function useDeleteLabBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billId: string) =>
      laboratoryService.bills.deleteLabBill(billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: laboratoryKeys.bills.lists() });
      toast.success('Lab bill deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting lab bill: ${error.message}`);
    },
  });
}

/**
 * Lab Orders Hooks
 */

// Get lab orders
export function useLabOrders(query = {}) {
  return useQuery({
    queryKey: laboratoryKeys.orders.list(query),
    queryFn: () => laboratoryService.orders.getLabOrders(query),
    staleTime: 1 * 60 * 1000,
  });
}

// Update lab order
export function useUpdateLabOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      laboratoryService.orders.updateLabOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: laboratoryKeys.orders.all });
      toast.success('Lab order updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating lab order: ${error.message}`);
    },
  });
}

/**
 * Lab Inventory Hooks
 */

// Get lab inventory
export function useLabInventory(laboratoryId: string, query = {}) {
  return useQuery({
    queryKey: laboratoryKeys.inventory.list(laboratoryId, query),
    queryFn: () =>
      laboratoryService.inventory.getLabInventory(laboratoryId, query),
    enabled: !!laboratoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Search lab inventory
export function useSearchLabInventory(
  searchTerm: string,
  laboratoryId?: string,
) {
  return useQuery({
    queryKey: [
      ...laboratoryKeys.inventory.all,
      'search',
      searchTerm,
      laboratoryId,
    ],
    queryFn: () =>
      laboratoryService.inventory.searchLabInventory(searchTerm, laboratoryId),
    enabled: searchTerm.length > 2, // Only search if term is longer than 2 characters
    staleTime: 30 * 1000, // 30 seconds
  });
}
