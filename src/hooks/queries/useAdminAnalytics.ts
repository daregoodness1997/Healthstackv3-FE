import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsService } from '../../services/analytics/adminAnalytics.service';

export const useAdminAnalytics = (
  facilityId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: ['admin-analytics', facilityId, startDate, endDate],
    queryFn: () =>
      adminAnalyticsService.getAdminAnalytics({
        facilityId: facilityId || 'default',
        startDate,
        endDate,
      }),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
