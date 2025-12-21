import { useQuery } from '@tanstack/react-query';
import { marketPlaceAnalyticsService } from '../../services/analytics/marketPlaceAnalytics.service';

export const useMarketPlaceAnalytics = (
  facilityId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: [
      'marketplace-analytics',
      facilityId || 'default',
      startDate,
      endDate,
    ],
    queryFn: () =>
      marketPlaceAnalyticsService.getMarketPlaceAnalytics({
        facilityId: facilityId || 'default',
        startDate,
        endDate,
      }),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
