import client from '../../feathers';

export interface CaseManagementAnalyticsData {
  totalCases: number;
  openCases: number;
  closedCases: number;
  casesByStatus: Array<{ status: string; count: number }>;
  casesByPriority: Array<{ priority: string; count: number }>;
  averageResolutionTime: number;
  casesByCategory: Array<{ category: string; count: number }>;
}

export const caseManagementAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CaseManagementAnalyticsData> {
    try {
      const response = await client.service('case-management-analytics').find({
        query: {
          facilityId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching case management analytics:', error);
      throw error;
    }
  },
};
