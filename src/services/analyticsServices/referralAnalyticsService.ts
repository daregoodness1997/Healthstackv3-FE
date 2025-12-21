import client from '../../feathers';

export interface ReferralAnalyticsData {
  totalReferrals: number;
  incomingReferrals: number;
  outgoingReferrals: number;
  completedReferrals: number;
  referralsBySpecialty: Array<{ specialty: string; count: number }>;
  referralsByFacility: Array<{
    facility: string;
    incoming: number;
    outgoing: number;
  }>;
  averageProcessingTime: number;
}

export const referralAnalyticsService = {
  getReferralAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ReferralAnalyticsData> => {
    try {
      const service = client.service('referral-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching referral analytics:', error);
      throw error;
    }
  },
};
