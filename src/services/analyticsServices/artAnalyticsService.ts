import client from '../../feathers';

export interface ARTAnalyticsData {
  totalPatients: number;
  activeOnTreatment: number;
  viralLoadSuppression: number;
  lostToFollowUp: number;
  newEnrollments: number;
  adherenceRate: number;
  demographicBreakdown: Array<{ ageGroup: string; count: number }>;
  treatmentOutcomes: Array<{ outcome: string; count: number }>;
}

export const artAnalyticsService = {
  getARTAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ARTAnalyticsData> => {
    try {
      const service = client.service('art-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching ART analytics:', error);
      throw error;
    }
  },
};
