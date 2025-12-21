import mockData from './managedCareAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ManagedCareAnalyticsData {
  totalEnrollees: number;
  activePlans: number;
  claimsByStatus: Array<{ status: string; count: number }>;
  totalClaims: number;
  claimsApprovalRate: number;
  enrolleesByPlan?: Array<{ plan: string; count: number }>;
  monthlyClaims?: Array<{ month: string; claims: number; amount: number }>;
  utilizationRate: number;
}

export const managedCareAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ManagedCareAnalyticsData> {
    await delay(500);
    return mockData as ManagedCareAnalyticsData;
  },
};
