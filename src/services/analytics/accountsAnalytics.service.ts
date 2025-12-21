import mockData from './accountsAnalytics.mock.json';

export interface AccountsAnalyticsData {
  totalRevenue: number;
  totalExpenses: number;
  outstandingPayments: number;
  revenueByDepartment: Array<{ department: string; amount: number }>;
  expensesByCategory: Array<{ category: string; amount: number }>;
  monthlyTrend: Array<{ month: string; revenue: number; expenses: number }>;
}

class AccountsAnalyticsService {
  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAccountsAnalytics(params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AccountsAnalyticsData> {
    await this.delay();

    // TODO: Replace with actual API call when backend is ready
    // const service = client.service('accounts-analytics');
    // const response = await service.find({ query: params });
    // return response;

    // Return mock data for now
    return mockData as AccountsAnalyticsData;
  }
}

export const accountsAnalyticsService = new AccountsAnalyticsService();
