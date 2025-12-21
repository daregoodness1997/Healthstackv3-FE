import client from '../../feathers';

export interface AdminAnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalFacilities: number;
  totalModules: number;
  usersByRole: Array<{ role: string; count: number }>;
  facilitiesByType: Array<{ type: string; count: number }>;
  systemActivity: Array<{ date: string; logins: number; actions: number }>;
  moduleUsage: Array<{ module: string; usage: number }>;
}

export const adminAnalyticsService = {
  getAdminAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AdminAnalyticsData> => {
    try {
      const service = client.service('admin-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
      throw error;
    }
  },
};
