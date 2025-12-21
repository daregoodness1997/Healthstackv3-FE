import { useQuery } from '@tanstack/react-query';
import { accountsAnalyticsService } from '../../services/analytics/accountsAnalytics.service';

export const useAccountsAnalytics = (
  facilityId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: ['accounts-analytics', facilityId, startDate, endDate],
    queryFn: () =>
      accountsAnalyticsService.getAccountsAnalytics({
        facilityId: facilityId || 'default',
        startDate,
        endDate,
      }),
    enabled: true, // Always enabled since we're using mock data
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
