/**
 * TanStack Query hooks for Radiology Bills (Reports & Requests)
 *
 * These hooks query the bills service with Radiology order_category filters
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
// @ts-ignore - JS module
import client from '../../feathers';

interface UseRadiologyBillsParams {
  facilityId?: string;
  search?: string;
  billingStatus?: string;
  limit?: number;
  skip?: number;
}

interface RadiologyBillsResponse {
  data: any[];
  total: number;
  limit: number;
  skip: number;
}

/**
 * Fetch radiology reports (bills with Radiology order_category)
 */
export const useRadiologyBillReports = (params: UseRadiologyBillsParams) => {
  const billsService = client.service('bills');

  return useQuery<RadiologyBillsResponse, Error>({
    queryKey: [
      'radiology-reports',
      params.facilityId,
      params.search,
      params.limit,
      params.skip,
    ],
    queryFn: async () => {
      const query: any = {
        'participantInfo.billingFacility': params.facilityId,
        $or: [
          { 'orderInfo.orderObj.order_category': 'Radiology Order' },
          { 'orderInfo.orderObj.order_category': 'Radiology' },
        ],
        noAgg: true,
        $limit: params.limit || 20,
        $skip: params.skip || 0,
        $sort: { createdAt: -1 },
        $select: [
          'createdAt',
          'orderInfo',
          'serviceInfo',
          'billing_status',
          'report_status',
        ],
      };

      if (params.search) {
        query['$or'] = [
          {
            'orderInfo.orderObj.clientname': {
              $regex: params.search,
              $options: 'i',
            },
          },
          {
            'orderInfo.orderObj.order': {
              $regex: params.search,
              $options: 'i',
            },
          },
          {
            'orderInfo.orderObj.requestingdoctor_Name': {
              $regex: params.search,
              $options: 'i',
            },
          },
        ];
      }

      return await billsService.find({ query });
    },
    enabled: !!params.facilityId,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Fetch radiology requests (bills with Radiology order_category and optional billing status filter)
 */
export const useRadiologyBillRequests = (params: UseRadiologyBillsParams) => {
  const billsService = client.service('bills');

  return useQuery<RadiologyBillsResponse, Error>({
    queryKey: [
      'radiology-requests',
      params.facilityId,
      params.search,
      params.billingStatus,
      params.limit,
      params.skip,
    ],
    queryFn: async () => {
      const query: any = {
        'participantInfo.billingFacility': params.facilityId,
        $or: [
          { 'orderInfo.orderObj.order_category': 'Radiology Order' },
          { 'orderInfo.orderObj.order_category': 'Radiology' },
        ],
        noAgg: true,
        $limit: params.limit || 20,
        $skip: params.skip || 0,
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

      // Add billing status filter if set
      if (params.billingStatus) {
        query.billing_status = params.billingStatus;
      }

      if (params.search) {
        query['$or'] = [
          {
            'orderInfo.orderObj.clientname': {
              $regex: params.search,
              $options: 'i',
            },
          },
          {
            'orderInfo.orderObj.order': {
              $regex: params.search,
              $options: 'i',
            },
          },
          {
            'participantInfo.client.firstname': {
              $regex: params.search,
              $options: 'i',
            },
          },
          {
            'participantInfo.client.lastname': {
              $regex: params.search,
              $options: 'i',
            },
          },
        ];
      }

      return await billsService.find({ query });
    },
    enabled: !!params.facilityId,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Delete radiology bill (report or request)
 */
export const useDeleteRadiologyBill = () => {
  const queryClient = useQueryClient();
  const billsService = client.service('bills');

  return useMutation({
    mutationFn: async (billId: string) => {
      return await billsService.remove(billId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiology-reports'] });
      queryClient.invalidateQueries({ queryKey: ['radiology-requests'] });
      toast.success('Record deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
};
