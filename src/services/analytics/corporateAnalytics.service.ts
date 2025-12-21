import mockData from './corporateAnalytics.mock.json';

export interface CorporateAnalyticsData {
  totalCorporateClients: number;
  activePlans: number;
  totalEnrollees: number;
  totalRevenue: number;
  clientsByIndustry: Array<{
    industry: string;
    count: number;
    enrollees: number;
  }>;
  planDistribution: Array<{ plan: string; count: number; enrollees: number }>;
  revenueTrend: Array<{ month: string; revenue: number }>;
  utilizationRate: Array<{ month: string; rate: number }>;
}

class CorporateAnalyticsService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getCorporateAnalytics(params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<CorporateAnalyticsData> {
    await this.delay();
    return mockData as CorporateAnalyticsData;
  }
}

export const corporateAnalyticsService = new CorporateAnalyticsService();
