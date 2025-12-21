import client from '../../feathers';

export interface ImmunizationAnalyticsData {
  totalVaccinations: number;
  uniquePatients: number;
  coverageRate: number;
  vaccinationsByType: Array<{ vaccine: string; count: number }>;
  vaccinationsByAgeGroup: Array<{ ageGroup: string; count: number }>;
  complianceRate: number;
  monthlyTrend: Array<{ month: string; count: number }>;
}

export const immunizationAnalyticsService = {
  getImmunizationAnalytics: async (params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ImmunizationAnalyticsData> => {
    try {
      const service = client.service('immunization-analytics');
      const response = await service.find({ query: params });
      return response;
    } catch (error) {
      console.error('Error fetching immunization analytics:', error);
      throw error;
    }
  },
};
