/**
 * TanStack Query hooks for Appointments
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// @ts-ignore
import client from '../../feathers';
import { toast } from 'react-toastify';

export interface Appointment {
  _id: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  dob: string;
  gender: string;
  phone: string;
  email?: string;
  clientId: string;
  facility: string;
  locationId: string;
  location_name: string;
  location_type: string;
  practitionerId: string;
  practitioner_name: string;
  practitioner_profession?: string;
  practitioner_department?: string;
  appointment_type: string;
  appointment_status: string;
  appointment_reason?: string;
  appointmentClass?: string;
  start_time: string;
  end_time?: string;
  otp?: string;
  sponsor?: string;
  hmo?: string;
  policy?: any;
  client?: any;
  actions?: any[];
  createdAt: string;
  updatedAt: string;
}

interface UseAppointmentsParams {
  facilityId?: string;
  locationId?: string;
  locationType?: string;
  locationTypeFilter?: string;
  search?: string;
  appointmentType?: string;
  appointmentStatus?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
}

interface AppointmentsResponse {
  data: Appointment[];
  total: number;
  limit: number;
  skip: number;
}

/**
 * Fetch appointments with filtering and pagination
 */
export const useAppointments = (params: UseAppointmentsParams) => {
  return useQuery<AppointmentsResponse, Error>({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const query: any = {
        $limit: params.limit || 20,
        $skip: params.skip || 0,
        $sort: { start_time: 1 },
      };

      if (params.facilityId) {
        query.facility = params.facilityId;
      }

      if (params.locationId && params.locationType !== 'Front Desk') {
        query.locationId = params.locationId;
      }

      // Filter by location_type (Blood Bank, Clinic, Pharmacy, etc.)
      if (params.locationTypeFilter && params.locationTypeFilter !== 'All') {
        query.location_type = params.locationTypeFilter;
      }

      if (params.search) {
        query.$or = [
          { firstname: { $regex: params.search, $options: 'i' } },
          { lastname: { $regex: params.search, $options: 'i' } },
          { middlename: { $regex: params.search, $options: 'i' } },
          { phone: { $regex: params.search, $options: 'i' } },
          { appointment_type: { $regex: params.search, $options: 'i' } },
          { appointment_status: { $regex: params.search, $options: 'i' } },
          { appointment_reason: { $regex: params.search, $options: 'i' } },
          { location_type: { $regex: params.search, $options: 'i' } },
          { location_name: { $regex: params.search, $options: 'i' } },
          { practitioner_department: { $regex: params.search, $options: 'i' } },
          { practitioner_profession: { $regex: params.search, $options: 'i' } },
          { practitioner_name: { $regex: params.search, $options: 'i' } },
        ];
      }

      if (params.appointmentType) {
        query.appointment_type = params.appointmentType;
      }

      if (params.appointmentStatus) {
        query.appointment_status = params.appointmentStatus;
      }

      if (params.startDate || params.endDate) {
        query.start_time = {};
        if (params.startDate) {
          query.start_time.$gte = params.startDate;
        }
        if (params.endDate) {
          query.start_time.$lte = params.endDate;
        }
      }

      const response = await client.service('appointments').find({ query });

      return {
        data: response.data,
        total: response.total,
        limit: response.limit,
        skip: response.skip,
      };
    },
    enabled: !!params.facilityId,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Prefetch appointment details for hover optimization
 */
export const usePrefetchAppointment = () => {
  const queryClient = useQueryClient();

  return (appointmentId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['appointment', appointmentId],
      queryFn: async () => {
        return await client.service('appointments').get(appointmentId);
      },
      staleTime: 60000, // 1 minute
    });
  };
};

/**
 * Create new appointment
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: Partial<Appointment>) => {
      return await client.service('appointments').create(appointmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create appointment: ${error.message}`);
    },
  });
};

/**
 * Update appointment
 */
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Appointment>;
    }) => {
      return await client.service('appointments').patch(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update appointment: ${error.message}`);
    },
  });
};

/**
 * Delete appointment
 */
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      return await client.service('appointments').remove(appointmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete appointment: ${error.message}`);
    },
  });
};
