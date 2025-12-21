import client from '../../feathers';

export interface TheatreAnalyticsData {
  totalSurgeries: number;
  scheduledSurgeries: number;
  completedSurgeries: number;
  cancelledSurgeries: number;
  surgeryByType: Array<{ type: string; count: number }>;
  surgeryBySpecialty: Array<{ specialty: string; count: number }>;
  utilizationRate: number;
  averageDuration: number;
}

export const theatreAnalyticsService = {
  getTheatreAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TheatreAnalyticsData> => {
    try {
      const service = client.service('theatre-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching theatre analytics:', error);
      throw error;
    }
  },
};
