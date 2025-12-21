import client from '../../feathers';

export interface EngagementAnalyticsData {
  totalEngagements: number;
  activeEngagements: number;
  averageResponseTime: number;
  engagementRate: number;
  engagementsByChannel: Array<{ channel: string; count: number }>;
  engagementsByType: Array<{ type: string; count: number }>;
  monthlyTrend: Array<{
    month: string;
    engagements: number;
    responses: number;
  }>;
}

export const engagementAnalyticsService = {
  getEngagementAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<EngagementAnalyticsData> => {
    try {
      const service = client.service('engagement-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching engagement analytics:', error);
      throw error;
    }
  },
};
