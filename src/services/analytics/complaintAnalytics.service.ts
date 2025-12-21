import mockData from './complaintAnalytics.mock.json';

export interface ComplaintAnalyticsData {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  escalatedComplaints: number;
  averageResolutionTime: number;
  complaintsByCategory: Array<{ category: string; count: number }>;
  complaintsBySeverity: Array<{ severity: string; count: number }>;
  resolutionTrend: Array<{ month: string; received: number; resolved: number }>;
}

class ComplaintAnalyticsService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getComplaintAnalytics(params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ComplaintAnalyticsData> {
    await this.delay();
    return mockData as ComplaintAnalyticsData;
  }
}

export const complaintAnalyticsService = new ComplaintAnalyticsService();
