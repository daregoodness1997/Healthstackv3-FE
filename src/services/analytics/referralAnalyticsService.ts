import mockData from './referralAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ReferralAnalyticsData {
  totalReferrals: number;
  incomingReferrals: number;
  outgoingReferrals: number;
  pendingReferrals: number;
  referralsByStatus: Array<{ status: string; count: number }>;
  referralsBySpecialty: Array<{ specialty: string; count: number }>;
  monthlyReferrals?: Array<{
    month: string;
    outgoing: number;
    incoming: number;
  }>;
  acceptanceRate: number;
}

export const referralAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ReferralAnalyticsData> {
    await delay(500);
    return mockData as ReferralAnalyticsData;
  },
};
