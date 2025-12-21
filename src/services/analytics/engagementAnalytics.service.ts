import mockData from './engagementAnalytics.mock.json';

export interface EngagementAnalyticsData {
  totalPatients: number;
  activePatients: number;
  newPatients: number;
  returningPatients: number;
  engagementRate: number;
  appointmentAttendance: number;
  engagementByChannel: Array<{
    channel: string;
    users: number;
    engagement: number;
  }>;
  featureUsage: Array<{ feature: string; usage: number }>;
  engagementTrend: Array<{ month: string; active: number; engaged: number }>;
  satisfactionScore: number;
  npsScore: number;
}

class EngagementAnalyticsService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getEngagementAnalytics(params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<EngagementAnalyticsData> {
    await this.delay();
    return mockData as EngagementAnalyticsData;
  }
}

export const engagementAnalyticsService = new EngagementAnalyticsService();
