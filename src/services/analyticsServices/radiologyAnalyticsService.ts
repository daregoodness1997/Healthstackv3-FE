import client from '../../feathers';

export interface RadiologyStat {
  totalScans: number;
  pendingReports: number;
  completedReports: number;
  averageTurnaroundTime: number;
  scansByModality: Array<{ modality: string; count: number }>;
  scansByBodyPart: Array<{ bodyPart: string; count: number }>;
  monthlyTrend: Array<{ month: string; count: number }>;
}

export const radiologyAnalyticsService = {
  getRadiologyAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<RadiologyStat> => {
    try {
      const service = client.service('radiology-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching radiology analytics:', error);
      throw error;
    }
  },
};
