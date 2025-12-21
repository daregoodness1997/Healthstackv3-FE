import { useQuery } from '@tanstack/react-query';
import { documentationAnalyticsService } from '../../services/analytics/documentationAnalyticsService';
import { subDays } from 'date-fns';

export const useDocumentationAnalytics = (
  facilityId: string,
  startDate?: Date,
  endDate?: Date,
) => {
  const defaultStartDate = startDate || subDays(new Date(), 30);
  const defaultEndDate = endDate || new Date();

  return useQuery({
    queryKey: [
      'documentation-analytics',
      facilityId || 'default',
      defaultStartDate.toISOString(),
      defaultEndDate.toISOString(),
    ],
    queryFn: () =>
      documentationAnalyticsService.getAnalytics(
        facilityId || 'default',
        defaultStartDate,
        defaultEndDate,
      ),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
