import { useQuery } from '@tanstack/react-query';
import { providerRelationshipAnalyticsService } from '../../services/analytics/providerRelationshipAnalyticsService';
import { subDays } from 'date-fns';
import { useMemo } from 'react';

export const useProviderRelationshipAnalytics = (
  facilityId: string,
  startDate?: Date,
  endDate?: Date,
) => {
  const { defaultStartDate, defaultEndDate } = useMemo(() => ({
    defaultStartDate: startDate || subDays(new Date(), 30),
    defaultEndDate: endDate || new Date(),
  }), [startDate, endDate]);

  return useQuery({
    queryKey: [
      'provider-relationship-analytics',
      facilityId || 'default',
      defaultStartDate.toISOString(),
      defaultEndDate.toISOString(),
    ],
    queryFn: () =>
      providerRelationshipAnalyticsService.getAnalytics(
        facilityId || 'default',
        defaultStartDate,
        defaultEndDate,
      ),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
