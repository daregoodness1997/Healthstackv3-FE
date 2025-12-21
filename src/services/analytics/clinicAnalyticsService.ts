import mockData from './clinicAnalytics.mock.json';

export interface ClinicAnalyticsData {
  totalConsultations: number;
  totalPatients: number;
  averageWaitTime: number;
  consultationsByDoctor: Array<{ name: string; count: number }>;
  patientsByDepartment: Array<{ name: string; count: number }>;
  dailyConsultations: Array<{ date: string; count: number }>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Transform the existing mock data format to match the expected interface
function transformMockData(): ClinicAnalyticsData {
  const stats = mockData.stats as any[];
  return {
    totalConsultations: parseInt(stats[0]?.value?.replace(/,/g, '') || '0'),
    totalPatients: 1245, // Derived data
    averageWaitTime: parseInt(stats[2]?.value?.replace(/[^0-9]/g, '') || '0'),
    consultationsByDoctor:
      mockData.doctorPerformance?.labels?.map((name: string, i: number) => ({
        name,
        count: (mockData.doctorPerformance.data as number[])[i] || 0,
      })) || [],
    patientsByDepartment:
      mockData.departmentDistribution?.labels?.map(
        (name: string, i: number) => ({
          name,
          count: (mockData.departmentDistribution.data as number[])[i] || 0,
        }),
      ) || [],
    dailyConsultations: (mockData.consultationTimeline?.labels || []).map(
      (date: string, i: number) => ({
        date,
        count:
          (mockData.consultationTimeline.datasets?.[0]?.data as number[])?.[
            i
          ] || 0,
      }),
    ),
  };
}

export const clinicAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ClinicAnalyticsData> {
    // Simulate API delay
    await delay(500);
    return transformMockData();
  },
};
