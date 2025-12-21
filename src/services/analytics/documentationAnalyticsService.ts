import client from '../../feathers';

export interface DocumentationAnalyticsData {
  totalDocuments: number;
  documentsByType: Array<{ type: string; count: number }>;
  documentsByStatus: Array<{ status: string; count: number }>;
  recentUploads: number;
  storageUsed: number;
  documentsByDepartment: Array<{ department: string; count: number }>;
}

export const documentationAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<DocumentationAnalyticsData> {
    try {
      const response = await client.service('documentation-analytics').find({
        query: {
          facilityId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching documentation analytics:', error);
      throw error;
    }
  },
};
