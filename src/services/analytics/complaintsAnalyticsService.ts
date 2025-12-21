import mockData from './complaintAnalytics.mock.json';

export interface ComplaintsAnalyticsData {
  totalComplaints: number;
  openComplaints: number;
  resolvedComplaints: number;
  complaintsByCategory: Array<{ category: string; count: number }>;
  complaintsByPriority: Array<{ priority: string; count: number }>;
  averageResolutionTime: number;
  satisfactionRate: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const complaintsAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ComplaintsAnalyticsData> {
    // Simulate API delay
    await delay(500);
    return mockData as ComplaintsAnalyticsData;
  },
};
