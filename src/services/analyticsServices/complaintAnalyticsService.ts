import client from '../../feathers';

export interface ComplaintAnalyticsData {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  averageResolutionTime: number;
  complaintsByCategory: Array<{ category: string; count: number }>;
  complaintsBySeverity: Array<{ severity: string; count: number }>;
  resolutionTrend: Array<{ month: string; resolved: number; pending: number }>;
}

export const complaintAnalyticsService = {
  getComplaintAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ComplaintAnalyticsData> => {
    try {
      const service = client.service('complaint-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching complaint analytics:', error);
      throw error;
    }
  },
};
