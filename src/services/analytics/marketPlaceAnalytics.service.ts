import mockData from './marketPlaceAnalytics.mock.json';

export interface MarketPlaceAnalyticsData {
  totalProducts: number;
  listedProducts: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    product: string;
    sales: number;
    revenue: number;
  }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  salesTrend: Array<{ month: string; orders: number; revenue: number }>;
  vendorPerformance: Array<{ vendor: string; rating: number; orders: number }>;
}

class MarketPlaceAnalyticsService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getMarketPlaceAnalytics(params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<MarketPlaceAnalyticsData> {
    await this.delay();
    return mockData as MarketPlaceAnalyticsData;
  }
}

export const marketPlaceAnalyticsService = new MarketPlaceAnalyticsService();
