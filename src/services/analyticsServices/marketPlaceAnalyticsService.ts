import client from '../../feathers';

export interface MarketPlaceAnalyticsData {
  totalListings: number;
  activeListings: number;
  totalTransactions: number;
  totalRevenue: number;
  listingsByCategory: Array<{ category: string; count: number }>;
  topProducts: Array<{ product: string; sales: number; revenue: number }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
}

export const marketPlaceAnalyticsService = {
  getMarketPlaceAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<MarketPlaceAnalyticsData> => {
    try {
      const service = client.service('marketplace-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching marketplace analytics:', error);
      throw error;
    }
  },
};
