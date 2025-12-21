import mockData from './theatreAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface TheatreAnalyticsData {
  totalSurgeries: number;
  completedSurgeries: number;
  scheduledSurgeries: number;
  surgeriesByType: Array<{ type: string; count: number }>;
  surgeriesByStatus: Array<{ status: string; count: number }>;
  monthlySurgeries: Array<{ month: string; count: number }>;
  averageDuration: number;
  theatreUtilization: number;
}

export const theatreAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TheatreAnalyticsData> {
    await delay(500);
    return mockData as TheatreAnalyticsData;
  },
};
