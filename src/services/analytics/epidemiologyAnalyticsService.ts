import mockData from './epidemiologyAnalytics.mock.json';

export interface EpidemiologyAnalyticsData {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  casesByDisease: Array<{ disease: string; count: number }>;
  casesByRegion: Array<{ region: string; count: number }>;
  outbreakAlerts: number;
  trendsOverTime: Array<{ date: string; cases: number }>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const epidemiologyAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<EpidemiologyAnalyticsData> {
    // Simulate API delay
    await delay(500);
    return mockData as EpidemiologyAnalyticsData;
  },
};
