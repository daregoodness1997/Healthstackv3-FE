import mockData from './laboratoryAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface LaboratoryAnalyticsData {
  totalTests: number;
  completedTests: number;
  pendingTests: number;
  testsByType: Array<{ test: string; count: number }>;
  testsByStatus: Array<{ status: string; count: number }>;
  dailyTests: Array<{ date: string; count: number }>;
  averageTurnaroundTime: number;
}

export const laboratoryAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<LaboratoryAnalyticsData> {
    await delay(500);
    return mockData as LaboratoryAnalyticsData;
  },
};
