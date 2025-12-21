import { useQuery } from '@tanstack/react-query';
import { caseManagementAnalyticsService } from '../../services/analytics/caseManagementAnalyticsService';
import { subDays } from 'date-fns';

export const useCaseManagementAnalytics = (
  facilityId: string,
  startDate?: Date,
  endDate?: Date,
) => {
  const defaultStartDate = startDate || subDays(new Date(), 30);
  const defaultEndDate = endDate || new Date();

  return useQuery({
    queryKey: [
      'case-management-analytics',
      facilityId || 'default',
      defaultStartDate.toISOString(),
      defaultEndDate.toISOString(),
    ],
    queryFn: () =>
      caseManagementAnalyticsService.getAnalytics(
        facilityId || 'default',
        defaultStartDate,
        defaultEndDate,
      ),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
