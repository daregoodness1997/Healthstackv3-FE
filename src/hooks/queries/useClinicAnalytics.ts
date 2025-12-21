import { useQuery } from '@tanstack/react-query';
import { clinicAnalyticsService } from '../../services/analytics/clinicAnalyticsService';
import { useMemo } from 'react';

export const useClinicAnalytics = (
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
      'clinic-analytics',
      facilityId || 'default',
      defaultStartDate.toISOString(),
      defaultEndDate.toISOString(),
    ],
    queryFn: () =>
      clinicAnalyticsService.getAnalytics(
        facilityId || 'default',
        defaultStartDate,
        defaultEndDate,
      ),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
