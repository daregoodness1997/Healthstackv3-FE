import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import radiologyService, {
  Radiology,
  RadiologyReport,
  RadiologyRequest,
  RadiologyBill,
} from '../../services/radiologyService';

/**
 * TanStack Query hooks for Radiology module
 */

// Query Keys
export const radiologyKeys = {
  all: ['radiologies'] as const,
  lists: () => [...radiologyKeys.all, 'list'] as const,
  list: (filters: any) => [...radiologyKeys.lists(), { filters }] as const,
  details: () => [...radiologyKeys.all, 'detail'] as const,
  detail: (id: string) => [...radiologyKeys.details(), id] as const,
  reports: {
    all: ['radiology-reports'] as const,
    lists: () => [...radiologyKeys.reports.all, 'list'] as const,
    list: (filters: any) =>
      [...radiologyKeys.reports.lists(), { filters }] as const,
    detail: (id: string) =>
      [...radiologyKeys.reports.all, 'detail', id] as const,
    byClient: (clientId: string) =>
      [...radiologyKeys.reports.all, 'client', clientId] as const,
  },
  requests: {
    all: ['radiology-requests'] as const,
    lists: () => [...radiologyKeys.requests.all, 'list'] as const,
    list: (filters: any) =>
      [...radiologyKeys.requests.lists(), { filters }] as const,
    detail: (id: string) =>
      [...radiologyKeys.requests.all, 'detail', id] as const,
    byClient: (clientId: string) =>
      [...radiologyKeys.requests.all, 'client', clientId] as const,
  },
  bills: {
    all: ['radiology-bills'] as const,
    lists: () => [...radiologyKeys.bills.all, 'list'] as const,
    list: (filters: any) =>
      [...radiologyKeys.bills.lists(), { filters }] as const,
    detail: (id: string) => [...radiologyKeys.bills.all, 'detail', id] as const,
    byClient: (clientId: string) =>
      [...radiologyKeys.bills.all, 'client', clientId] as const,
    byRadiology: (radId: string) =>
      [...radiologyKeys.bills.all, 'radiology', radId] as const,
  },
  orders: {
    all: ['radiology-orders'] as const,
    list: (filters: any) => [...radiologyKeys.orders.all, { filters }] as const,
  },
};

/**
 * Radiology Location Hooks
 */

// Get all radiologies for a facility
export function useRadiologies(facilityId: string, query = {}) {
  return useQuery({
    queryKey: radiologyKeys.list({ facilityId, ...query }),
    queryFn: () => radiologyService.radiology.getRadiologies(facilityId, query),
    enabled: !!facilityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single radiology
export function useRadiology(radiologyId: string) {
  return useQuery({
    queryKey: radiologyKeys.detail(radiologyId),
    queryFn: () => radiologyService.radiology.getRadiology(radiologyId),
    enabled: !!radiologyId,
    staleTime: 5 * 60 * 1000,
  });
}

// Create radiology
export function useCreateRadiology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Radiology, '_id'>) =>
      radiologyService.radiology.createRadiology(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: radiologyKeys.lists() });
      toast.success('Radiology created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating radiology: ${error.message}`);
    },
  });
}

// Update radiology
export function useUpdateRadiology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Radiology> }) =>
      radiologyService.radiology.updateRadiology(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: radiologyKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: radiologyKeys.lists() });
      toast.success('Radiology updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating radiology: ${error.message}`);
    },
  });
}

// Delete radiology
export function useDeleteRadiology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (radiologyId: string) =>
      radiologyService.radiology.deleteRadiology(radiologyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: radiologyKeys.lists() });
      toast.success('Radiology deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting radiology: ${error.message}`);
    },
  });
}

/**
 * Radiology Reports Hooks
 */

// Get all radiology reports
export function useRadiologyReports(query = {}) {
  return useQuery({
    queryKey: radiologyKeys.reports.list(query),
    queryFn: () => radiologyService.reports.getRadiologyReports(query),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get reports for specific client
export function useClientRadiologyReports(clientId: string) {
  return useQuery({
    queryKey: radiologyKeys.reports.byClient(clientId),
    queryFn: () => radiologyService.reports.getClientRadiologyReports(clientId),
    enabled: !!clientId,
    staleTime: 1 * 60 * 1000,
  });
}

// Get single radiology report
export function useRadiologyReport(reportId: string) {
  return useQuery({
    queryKey: radiologyKeys.reports.detail(reportId),
    queryFn: () => radiologyService.reports.getRadiologyReport(reportId),
    enabled: !!reportId,
  });
}

// Create radiology report
export function useCreateRadiologyReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<RadiologyReport, '_id'>) =>
      radiologyService.reports.createRadiologyReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: radiologyKeys.reports.lists(),
      });
      toast.success('Radiology report created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating radiology report: ${error.message}`);
    },
  });
}

// Update radiology report
export function useUpdateRadiologyReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<RadiologyReport>;
    }) => radiologyService.reports.updateRadiologyReport(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: radiologyKeys.reports.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: radiologyKeys.reports.lists(),
      });
      toast.success('Radiology report updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating radiology report: ${error.message}`);
    },
  });
}

// Delete radiology report
export function useDeleteRadiologyReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string) =>
      radiologyService.reports.deleteRadiologyReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: radiologyKeys.reports.lists(),
      });
      toast.success('Radiology report deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting radiology report: ${error.message}`);
    },
  });
}

/**
 * Radiology Requests Hooks
 */

// Get all radiology requests
export function useRadiologyRequests(query = {}) {
  return useQuery({
    queryKey: radiologyKeys.requests.list(query),
    queryFn: () => radiologyService.requests.getRadiologyRequests(query),
    staleTime: 1 * 60 * 1000,
  });
}

// Get requests for specific client
export function useClientRadiologyRequests(clientId: string) {
  return useQuery({
    queryKey: radiologyKeys.requests.byClient(clientId),
    queryFn: () =>
      radiologyService.requests.getClientRadiologyRequests(clientId),
    enabled: !!clientId,
    staleTime: 1 * 60 * 1000,
  });
}

// Get single radiology request
export function useRadiologyRequest(requestId: string) {
  return useQuery({
    queryKey: radiologyKeys.requests.detail(requestId),
    queryFn: () => radiologyService.requests.getRadiologyRequest(requestId),
    enabled: !!requestId,
  });
}

// Create radiology request
export function useCreateRadiologyRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<RadiologyRequest, '_id'>) =>
      radiologyService.requests.createRadiologyRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: radiologyKeys.requests.lists(),
      });
      toast.success('Radiology request created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating radiology request: ${error.message}`);
    },
  });
}

// Update radiology request
export function useUpdateRadiologyRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<RadiologyRequest>;
    }) => radiologyService.requests.updateRadiologyRequest(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: radiologyKeys.requests.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: radiologyKeys.requests.lists(),
      });
      toast.success('Radiology request updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating radiology request: ${error.message}`);
    },
  });
}

// Delete radiology request
export function useDeleteRadiologyRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      radiologyService.requests.deleteRadiologyRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: radiologyKeys.requests.lists(),
      });
      toast.success('Radiology request deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting radiology request: ${error.message}`);
    },
  });
}

/**
 * Radiology Bills Hooks
 */

// Get all radiology bills
export function useRadiologyBills(query = {}) {
  return useQuery({
    queryKey: radiologyKeys.bills.list(query),
    queryFn: () => radiologyService.bills.getRadiologyBills(query),
    staleTime: 1 * 60 * 1000,
  });
}

// Get bills for specific radiology
export function useRadiologyLocationBills(radiologyId: string, query = {}) {
  return useQuery({
    queryKey: radiologyKeys.bills.byRadiology(radiologyId),
    queryFn: () =>
      radiologyService.bills.getRadiologyLocationBills(radiologyId, query),
    enabled: !!radiologyId,
    staleTime: 1 * 60 * 1000,
  });
}

// Get bills for specific client
export function useClientRadiologyBills(clientId: string) {
  return useQuery({
    queryKey: radiologyKeys.bills.byClient(clientId),
    queryFn: () => radiologyService.bills.getClientRadiologyBills(clientId),
    enabled: !!clientId,
    staleTime: 1 * 60 * 1000,
  });
}

// Get single radiology bill
export function useRadiologyBill(billId: string) {
  return useQuery({
    queryKey: radiologyKeys.bills.detail(billId),
    queryFn: () => radiologyService.bills.getRadiologyBill(billId),
    enabled: !!billId,
  });
}

// Create radiology bill
export function useCreateRadiologyBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<RadiologyBill, '_id'>) =>
      radiologyService.bills.createRadiologyBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: radiologyKeys.bills.lists() });
      toast.success('Radiology bill created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating radiology bill: ${error.message}`);
    },
  });
}

// Update radiology bill
export function useUpdateRadiologyBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RadiologyBill> }) =>
      radiologyService.bills.updateRadiologyBill(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: radiologyKeys.bills.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: radiologyKeys.bills.lists() });
      toast.success('Radiology bill updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating radiology bill: ${error.message}`);
    },
  });
}

// Delete radiology bill
export function useDeleteRadiologyBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billId: string) =>
      radiologyService.bills.deleteRadiologyBill(billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: radiologyKeys.bills.lists() });
      toast.success('Radiology bill deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting radiology bill: ${error.message}`);
    },
  });
}

/**
 * Radiology Orders Hooks
 */

// Get radiology orders
export function useRadiologyOrders(query = {}) {
  return useQuery({
    queryKey: radiologyKeys.orders.list(query),
    queryFn: () => radiologyService.orders.getRadiologyOrders(query),
    staleTime: 1 * 60 * 1000,
  });
}

// Update radiology order
export function useUpdateRadiologyOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      radiologyService.orders.updateRadiologyOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: radiologyKeys.orders.all });
      toast.success('Radiology order updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Error updating radiology order: ${error.message}`);
    },
  });
}

/**
 * Radiology Notifications Hook
 */
export function useSendRadiologyNotification() {
  return useMutation({
    mutationFn: (data: any) =>
      radiologyService.notifications.sendNotification(data),
    onSuccess: () => {
      toast.success('Notification sent successfully');
    },
    onError: (error: any) => {
      toast.error(`Error sending notification: ${error.message}`);
    },
  });
}
