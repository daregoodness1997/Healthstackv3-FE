import client from '../../feathers';

export interface BloodbankAnalyticsData {
  totalUnits: number;
  availableUnits: number;
  expiredUnits: number;
  crossmatchedUnits: number;
  donationsByBloodType: Array<{ bloodType: string; count: number }>;
  utilizationRate: number;
  donorStatistics: {
    totalDonors: number;
    firstTimeDonors: number;
    repeatDonors: number;
  };
}

export const bloodbankAnalyticsService = {
  getBloodbankAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<BloodbankAnalyticsData> => {
    try {
      const service = client.service('bloodbank-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching bloodbank analytics:', error);
      throw error;
    }
  },
};
