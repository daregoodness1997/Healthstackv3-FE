import mockData from './financeAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface FinanceAnalyticsData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueByDepartment: Array<{ department: string; revenue: number }>;
  expensesByCategory: Array<{ category: string; amount: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  outstandingPayments: number;
}

export const financeAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<FinanceAnalyticsData> {
    await delay(500);
    return mockData as FinanceAnalyticsData;
  },
};
