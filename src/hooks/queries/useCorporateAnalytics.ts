import { useQuery } from '@tanstack/react-query';
import { corporateAnalyticsService } from '../../services/analytics/corporateAnalytics.service';

export const useCorporateAnalytics = (
  facilityId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: [
      'corporate-analytics',
      facilityId || 'default',
      startDate,
      endDate,
    ],
    queryFn: () =>
      corporateAnalyticsService.getCorporateAnalytics({
        facilityId: facilityId || 'default',
        startDate,
        endDate,
      }),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
