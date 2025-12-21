import mockData from './crmAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface CRMAnalyticsData {
  totalContacts: number;
  activeLeads: number;
  convertedLeads: number;
  leadsBySource: Array<{ source: string; count: number }>;
  leadsByStatus: Array<{ status: string; count: number }>;
  conversionRate: number;
  revenueBySource: Array<{ source: string; revenue: number }>;
  monthlyTrend?: Array<{ month: string; contacts: number; converted: number }>;
}

export const crmAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<CRMAnalyticsData> {
    await delay(500);
    return mockData as CRMAnalyticsData;
  },
};
