import { useQuery } from '@tanstack/react-query';
import { patientPortalAnalyticsService } from '../../services/analytics/patientPortalAnalytics.service';

export const usePatientPortalAnalytics = (
  facilityId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: [
      'patient-portal-analytics',
      facilityId || 'default',
      startDate,
      endDate,
    ],
    queryFn: () =>
      patientPortalAnalyticsService.getPatientPortalAnalytics({
        facilityId: facilityId || 'default',
        startDate,
        endDate,
      }),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
