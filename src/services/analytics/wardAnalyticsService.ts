import mockData from './wardAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface WardAnalyticsData {
  totalAdmissions: number;
  currentPatients: number;
  dischargedPatients: number;
  admissionsByWard: Array<{ ward: string; count: number }>;
  bedOccupancy: Array<{ ward: string; occupied: number; total: number }>;
  dailyAdmissions: Array<{
    date: string;
    admissions: number;
    discharges: number;
  }>;
  averageStayDuration: number;
  occupancyRate: number;
}

export const wardAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<WardAnalyticsData> {
    await delay(500);
    return mockData as WardAnalyticsData;
  },
};
