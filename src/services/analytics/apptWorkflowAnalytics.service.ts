import mockData from './apptWorkflowAnalytics.mock.json';

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

class ApptWorkflowAnalyticsService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getApptWorkflowAnalytics(params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApptWorkflowAnalyticsData> {
    await this.delay();
    return mockData as ApptWorkflowAnalyticsData;
  }
}

export const apptWorkflowAnalyticsService = new ApptWorkflowAnalyticsService();
