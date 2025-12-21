import mockData from './artAnalytics.mock.json';

export interface ARTAnalyticsData {
  totalPatients: number;
  activePatients: number;
  newEnrollments: number;
  patientsByRegimenType: Array<{ regimen: string; count: number }>;
  adherenceRate: number;
  viralLoadSuppression: number;
  monthlyEnrollments: Array<{ month: string; count: number }>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const artAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ARTAnalyticsData> {
    // Simulate API delay
    await delay(500);
    return mockData as ARTAnalyticsData;
  },
};
