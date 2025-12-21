import mockData from './immunizationAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ImmunizationAnalyticsData {
  totalVaccinations: number;
  completedVaccinations: number;
  pendingVaccinations: number;
  vaccinationsByType: Array<{ vaccine: string; count: number }>;
  vaccinationsByAgeGroup: Array<{ ageGroup: string; count: number }>;
  dailyVaccinations: Array<{ date: string; count: number }>;
  coverageRate: number;
}

export const immunizationAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ImmunizationAnalyticsData> {
    await delay(500);
    return mockData as ImmunizationAnalyticsData;
  },
};
