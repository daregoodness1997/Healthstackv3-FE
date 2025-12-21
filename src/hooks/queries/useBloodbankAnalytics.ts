import { useQuery } from '@tanstack/react-query';
import { bloodbankAnalyticsService } from '../../services/analytics/bloodbankAnalyticsService';
import { useMemo } from 'react';

export const useBloodbankAnalytics = (
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
      'bloodbank-analytics',
      facilityId || 'default',
      defaultStartDate.toISOString(),
      defaultEndDate.toISOString(),
    ],
    queryFn: () =>
      bloodbankAnalyticsService.getAnalytics(
        facilityId || 'default',
        defaultStartDate,
        defaultEndDate,
      ),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
