import mockData from './adminAnalytics.mock.json';

export interface AdminAnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalFacilities: number;
  totalModules: number;
  usersByRole: Array<{ role: string; count: number }>;
  facilitiesByType: Array<{ type: string; count: number }>;
  systemActivity: Array<{ date: string; logins: number; actions: number }>;
  moduleUsage: Array<{ module: string; usage: number }>;
}

class AdminAnalyticsService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAdminAnalytics(params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AdminAnalyticsData> {
    await this.delay();
    return mockData as AdminAnalyticsData;
  }
}

export const adminAnalyticsService = new AdminAnalyticsService();
