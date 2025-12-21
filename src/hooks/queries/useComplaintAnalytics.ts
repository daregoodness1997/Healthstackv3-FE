import { useQuery } from '@tanstack/react-query';
import { complaintAnalyticsService } from '../../services/analytics/complaintAnalytics.service';

export const useComplaintAnalytics = (
  facilityId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: [
      'complaint-analytics',
      facilityId || 'default',
      startDate,
      endDate,
    ],
    queryFn: () =>
      complaintAnalyticsService.getComplaintAnalytics({
        facilityId: facilityId || 'default',
        startDate,
        endDate,
      }),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
