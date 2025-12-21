import { useQuery } from '@tanstack/react-query';
import { inventoryAnalyticsService } from '../../services/analytics/inventoryAnalyticsService';
import { subDays } from 'date-fns';
import { useMemo } from 'react';

export const useInventoryAnalytics = (
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
      'inventory-analytics',
      facilityId || 'default',
      defaultStartDate.toISOString(),
      defaultEndDate.toISOString(),
    ],
    queryFn: () =>
      inventoryAnalyticsService.getAnalytics(
        facilityId || 'default',
        defaultStartDate,
        defaultEndDate,
      ),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
