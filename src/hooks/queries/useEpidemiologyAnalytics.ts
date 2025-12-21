import { useQuery } from '@tanstack/react-query';
import { epidemiologyAnalyticsService } from '../../services/analytics/epidemiologyAnalyticsService';
import { useMemo } from 'react';

export const useEpidemiologyAnalytics = (
  facilityId: string,
  startDate?: Date,
  endDate?: Date,
) => {
  const { defaultStartDate, defaultEndDate } = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      defaultStartDate: startDate || thirtyDaysAgo,
      defaultEndDate: endDate || now,
    };
  }, [startDate, endDate]);

  return useQuery({
    queryKey: [
      'epidemiology-analytics',
      facilityId || 'default',
      defaultStartDate.toISOString(),
      defaultEndDate.toISOString(),
    ],
    queryFn: () =>
      epidemiologyAnalyticsService.getAnalytics(
        facilityId || 'default',
        defaultStartDate,
        defaultEndDate,
      ),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
