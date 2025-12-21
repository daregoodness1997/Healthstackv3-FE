import mockData from './communicationAnalytics.mock.json';

export interface CommunicationAnalyticsData {
  totalMessages: number;
  sentMessages: number;
  receivedMessages: number;
  messagesByChannel: Array<{ channel: string; count: number }>;
  messagesByStatus: Array<{ status: string; count: number }>;
  averageResponseTime: number;
  dailyMessages: Array<{ date: string; count: number }>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const communicationAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CommunicationAnalyticsData> {
    // Simulate API delay
    await delay(500);
    return mockData as CommunicationAnalyticsData;
  },
};
