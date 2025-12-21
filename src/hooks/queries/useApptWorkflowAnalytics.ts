import { useQuery } from '@tanstack/react-query';
import { apptWorkflowAnalyticsService } from '../../services/analytics/apptWorkflowAnalytics.service';

export const useApptWorkflowAnalytics = (
  facilityId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: [
      'appointment-workflow-analytics',
      facilityId,
      startDate,
      endDate,
    ],
    queryFn: () =>
      apptWorkflowAnalyticsService.getApptWorkflowAnalytics({
        facilityId: facilityId || 'default',
        startDate,
        endDate,
      }),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
