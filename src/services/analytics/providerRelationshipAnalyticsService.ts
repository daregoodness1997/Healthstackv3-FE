import mockData from './providerRelationshipAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ProviderRelationshipAnalyticsData {
  totalProviders: number;
  activeContracts: number;
  pendingContracts: number;
  providersByType: Array<{ type: string; count: number }>;
  referralsByProvider: Array<{ provider: string; referrals: number }>;
  monthlyReferrals?: Array<{ month: string; referrals: number }>;
  partnershipValue: number;
  satisfactionScore: number;
}

export const providerRelationshipAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ProviderRelationshipAnalyticsData> {
    await delay(500);
    return mockData as ProviderRelationshipAnalyticsData;
  },
};
