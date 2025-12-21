import mockData from './bloodbankAnalytics.mock.json';

export interface BloodbankAnalyticsData {
  totalUnits: number;
  availableUnits: number;
  issuedUnits: number;
  unitsByBloodGroup: Array<{ bloodGroup: string; units: number }>;
  expiringUnits: Array<{
    bloodGroup: string;
    units: number;
    expiryDate: string;
  }>;
  dailyIssuance: Array<{ date: string; units: number }>;
  donorsByType: Array<{ type: string; count: number }>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const bloodbankAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<BloodbankAnalyticsData> {
    // Simulate API delay
    await delay(500);
    return mockData as BloodbankAnalyticsData;
  },
};
