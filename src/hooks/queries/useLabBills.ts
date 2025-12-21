import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
// @ts-ignore - JS module
import client from '../../feathers';

/**
 * Custom hooks for Laboratory Bills (similar to Radiology Bills)
 * Uses bills service with Laboratory order_category filtering
 */

export interface UseLabBillsParams {
  facilityId?: string;
  search?: string;
  billingStatus?: string;
  limit?: number;
  skip?: number;
}

/**
 * Hook to fetch laboratory bill reports
 * Fetches bills with order_category "Lab Order" or "Laboratory"
 */
export function useLabBillReports(params: UseLabBillsParams) {
  const { facilityId, search, limit = 20, skip = 0 } = params;

  return useQuery({
    queryKey: ['lab-reports', facilityId, search, limit, skip],
    queryFn: async () => {
      const billsService = client.service('bills');

      const query: any = {
        'participantInfo.billingFacility': facilityId,
        $or: [
          { 'orderInfo.orderObj.order_category': 'Lab Order' },
          { 'orderInfo.orderObj.order_category': 'Laboratory' },
        ],
        noAgg: true,
        $limit: limit,
        $skip: skip,
        $sort: { createdAt: -1 },
        $select: [
          'createdAt',
          'orderInfo',
          'serviceInfo',
          'billing_status',
          'report_status',
        ],
      };

      // Add search filter if provided
      if (search) {
        query['$or'] = [
          {
            'orderInfo.orderObj.clientname': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'orderInfo.orderObj.order': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'orderInfo.orderObj.requestingdoctor_Name': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'participantInfo.client.firstname': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'participantInfo.client.lastname': {
              $regex: search,
              $options: 'i',
            },
          },
        ];
      }

      return await billsService.find({ query });
    },
    enabled: !!facilityId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch laboratory bill requests (with billing status filter)
 * Fetches bills with order_category "Lab Order" or "Laboratory"
 */
export function useLabBillRequests(params: UseLabBillsParams) {
  const { facilityId, search, billingStatus, limit = 20, skip = 0 } = params;

  return useQuery({
    queryKey: ['lab-requests', facilityId, search, billingStatus, limit, skip],
    queryFn: async () => {
      const billsService = client.service('bills');

      const query: any = {
        'participantInfo.billingFacility': facilityId,
        $or: [
          { 'orderInfo.orderObj.order_category': 'Lab Order' },
          { 'orderInfo.orderObj.order_category': 'Laboratory' },
        ],
        noAgg: true,
        $limit: limit,
        $skip: skip,
        $sort: { createdAt: -1 },
        $select: [
          'createdAt',
          'orderInfo',
          'serviceInfo',
          'billing_status',
          'report_status',
          'amount',
          'participantInfo',
        ],
      };

      // Add billing status filter if provided
      if (billingStatus) {
        query.billing_status = billingStatus;
      }

      // Add search filter if provided
      if (search) {
        query['$or'] = [
          {
            'orderInfo.orderObj.clientname': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'orderInfo.orderObj.order': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'participantInfo.client.firstname': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'participantInfo.client.lastname': {
              $regex: search,
              $options: 'i',
            },
          },
        ];
      }

      return await billsService.find({ query });
    },
    enabled: !!facilityId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to delete a laboratory bill
 */
export function useDeleteLabBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (billId: string) => {
      const billsService = client.service('bills');
      return await billsService.remove(billId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-reports'] });
      queryClient.invalidateQueries({ queryKey: ['lab-requests'] });
      toast.success('Lab bill deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete lab bill: ${error.message}`);
    },
  });
}
