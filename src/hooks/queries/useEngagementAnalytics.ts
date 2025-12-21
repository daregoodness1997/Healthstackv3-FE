import { useQuery } from '@tanstack/react-query';
import { engagementAnalyticsService } from '../../services/analytics/engagementAnalytics.service';

export const useEngagementAnalytics = (
  facilityId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: [
      'engagement-analytics',
      facilityId || 'default',
      startDate,
      endDate,
    ],
    queryFn: () =>
      engagementAnalyticsService.getEngagementAnalytics({
        facilityId: facilityId || 'default',
        startDate,
        endDate,
      }),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
