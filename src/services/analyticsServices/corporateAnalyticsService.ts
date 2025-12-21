import client from '../../feathers';

export interface CorporateAnalyticsData {
  totalEmployees: number;
  activePlans: number;
  totalDependents: number;
  utilizationRate: number;
  claimsByDepartment: Array<{
    department: string;
    claims: number;
    amount: number;
  }>;
  healthMetrics: Array<{ metric: string; value: number }>;
  employeeEngagement: {
    enrollmentRate: number;
    satisfactionScore: number;
  };
}

export const corporateAnalyticsService = {
  getCorporateAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<CorporateAnalyticsData> => {
    try {
      const service = client.service('corporate-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching corporate analytics:', error);
      throw error;
    }
  },
};
