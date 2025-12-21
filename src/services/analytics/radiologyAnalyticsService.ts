import mockData from './radiologyAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface RadiologyAnalyticsData {
  totalScans: number;
  completedScans: number;
  pendingScans: number;
  scansByModality: Array<{ modality: string; count: number }>;
  scansByBodyPart: Array<{ bodyPart: string; count: number }>;
  dailyScans: Array<{ date: string; count: number }>;
  averageReportTime: number;
}

export const radiologyAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<RadiologyAnalyticsData> {
    await delay(500);
    return mockData as RadiologyAnalyticsData;
  },
};
