import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  appointmentAnalyticsService,
  AppointmentStat,
  StatusTimeline,
  DistributionData,
  AppointmentAnalyticsData,
  AppointmentAnalyticsFilters,
} from '../../services/analytics/appointmentAnalytics.service';

// Query keys
export const appointmentAnalyticsKeys = {
  all: ['appointmentAnalytics'] as const,
  stats: (filters?: AppointmentAnalyticsFilters) =>
    [...appointmentAnalyticsKeys.all, 'stats', filters] as const,
  statusTimeline: (filters?: AppointmentAnalyticsFilters) =>
    [...appointmentAnalyticsKeys.all, 'statusTimeline', filters] as const,
  ageDistribution: (filters?: AppointmentAnalyticsFilters) =>
    [...appointmentAnalyticsKeys.all, 'ageDistribution', filters] as const,
  genderDistribution: (filters?: AppointmentAnalyticsFilters) =>
    [...appointmentAnalyticsKeys.all, 'genderDistribution', filters] as const,
  maritalStatus: (filters?: AppointmentAnalyticsFilters) =>
    [...appointmentAnalyticsKeys.all, 'maritalStatus', filters] as const,
  appointmentLocation: (filters?: AppointmentAnalyticsFilters) =>
    [...appointmentAnalyticsKeys.all, 'appointmentLocation', filters] as const,
  religionDistribution: (filters?: AppointmentAnalyticsFilters) =>
    [...appointmentAnalyticsKeys.all, 'religionDistribution', filters] as const,
  professionDistribution: (filters?: AppointmentAnalyticsFilters) =>
    [
      ...appointmentAnalyticsKeys.all,
      'professionDistribution',
      filters,
    ] as const,
  appointmentType: (filters?: AppointmentAnalyticsFilters) =>
    [...appointmentAnalyticsKeys.all, 'appointmentType', filters] as const,
  appointmentClass: (filters?: AppointmentAnalyticsFilters) =>
    [...appointmentAnalyticsKeys.all, 'appointmentClass', filters] as const,
  allAnalytics: (filters?: AppointmentAnalyticsFilters) =>
    [...appointmentAnalyticsKeys.all, 'allAnalytics', filters] as const,
};

// Hook for fetching all analytics data at once
export const useAppointmentAnalytics = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<AppointmentAnalyticsData, Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.allAnalytics(filters),
    queryFn: () => appointmentAnalyticsService.getAllAnalytics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Individual hooks for granular data fetching
export const useAppointmentStats = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<AppointmentStat[], Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.stats(filters),
    queryFn: () => appointmentAnalyticsService.getStats(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useStatusTimeline = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<StatusTimeline, Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.statusTimeline(filters),
    queryFn: () => appointmentAnalyticsService.getStatusTimeline(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAgeDistribution = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<DistributionData, Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.ageDistribution(filters),
    queryFn: () => appointmentAnalyticsService.getAgeDistribution(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGenderDistribution = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<DistributionData, Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.genderDistribution(filters),
    queryFn: () => appointmentAnalyticsService.getGenderDistribution(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMaritalStatus = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<DistributionData, Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.maritalStatus(filters),
    queryFn: () => appointmentAnalyticsService.getMaritalStatus(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAppointmentLocation = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<DistributionData, Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.appointmentLocation(filters),
    queryFn: () => appointmentAnalyticsService.getAppointmentLocation(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useReligionDistribution = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<DistributionData, Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.religionDistribution(filters),
    queryFn: () => appointmentAnalyticsService.getReligionDistribution(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProfessionDistribution = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<DistributionData, Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.professionDistribution(filters),
    queryFn: () =>
      appointmentAnalyticsService.getProfessionDistribution(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAppointmentType = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<DistributionData, Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.appointmentType(filters),
    queryFn: () => appointmentAnalyticsService.getAppointmentType(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAppointmentClass = (
  filters?: AppointmentAnalyticsFilters,
): UseQueryResult<DistributionData, Error> => {
  return useQuery({
    queryKey: appointmentAnalyticsKeys.appointmentClass(filters),
    queryFn: () => appointmentAnalyticsService.getAppointmentClass(filters),
    staleTime: 5 * 60 * 1000,
  });
};
