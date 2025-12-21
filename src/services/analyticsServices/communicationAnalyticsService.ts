import client from '../../feathers';

export interface CommunicationAnalyticsData {
  totalMessages: number;
  emailsSent: number;
  smsSent: number;
  deliveryRate: number;
  messagesByChannel: Array<{ channel: string; count: number }>;
  campaignPerformance: Array<{
    campaign: string;
    sent: number;
    opened: number;
    clicked: number;
  }>;
  monthlyTrend: Array<{ month: string; sent: number; delivered: number }>;
}

export const communicationAnalyticsService = {
  getCommunicationAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<CommunicationAnalyticsData> => {
    try {
      const service = client.service('communication-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching communication analytics:', error);
      throw error;
    }
  },
};
