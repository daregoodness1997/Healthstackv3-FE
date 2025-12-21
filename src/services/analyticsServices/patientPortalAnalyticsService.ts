import client from '../../feathers';

export interface PatientPortalAnalyticsData {
  totalRegistrations: number;
  activeUsers: number;
  appointmentsBooked: number;
  prescriptionsViewed: number;
  labResultsViewed: number;
  featureUsage: Array<{ feature: string; usage: number }>;
  userEngagement: Array<{ date: string; logins: number; actions: number }>;
  satisfactionScore: number;
}

export const patientPortalAnalyticsService = {
  getPatientPortalAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PatientPortalAnalyticsData> => {
    try {
      const service = client.service('patient-portal-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching patient portal analytics:', error);
      throw error;
    }
  },
};
