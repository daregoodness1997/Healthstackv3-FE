import client from '../../feathers';

export interface AccountsAnalyticsData {
  totalRevenue: number;
  totalExpenses: number;
  outstandingPayments: number;
  revenueByDepartment: Array<{ department: string; amount: number }>;
  expensesByCategory: Array<{ category: string; amount: number }>;
  monthlyTrend: Array<{ month: string; revenue: number; expenses: number }>;
}

export const accountsAnalyticsService = {
  getAccountsAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AccountsAnalyticsData> => {
    try {
      const service = client.service('accounts-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching accounts analytics:', error);
      throw error;
    }
  },
};
