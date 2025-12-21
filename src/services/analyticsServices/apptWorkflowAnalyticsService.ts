import client from '../../feathers';

export interface ApptWorkflowAnalyticsData {
  totalWorkflows: number;
  activeWorkflows: number;
  completedWorkflows: number;
  averageCompletionTime: number;
  workflowsByStatus: Array<{ status: string; count: number }>;
  workflowsByType: Array<{ type: string; count: number }>;
  completionRateTrend: Array<{
    date: string;
    completed: number;
    total: number;
  }>;
}

export const apptWorkflowAnalyticsService = {
  getApptWorkflowAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApptWorkflowAnalyticsData> => {
    try {
      const service = client.service('appointment-workflow-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching appointment workflow analytics:', error);
      throw error;
    }
  },
};
