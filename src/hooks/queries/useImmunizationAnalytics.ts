import { useQuery } from '@tanstack/react-query';
import { immunizationAnalyticsService } from '../../services/analytics/immunizationAnalyticsService';
import { subDays } from 'date-fns';
import { useMemo } from 'react';

export const useImmunizationAnalytics = (
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
      'immunization-analytics',
      facilityId || 'default',
      defaultStartDate.toISOString(),
      defaultEndDate.toISOString(),
    ],
    queryFn: () =>
      immunizationAnalyticsService.getAnalytics(
        facilityId || 'default',
        defaultStartDate,
        defaultEndDate,
      ),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
