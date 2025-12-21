import mockData from './patientPortalAnalytics.mock.json';

export interface PatientPortalAnalyticsData {
  totalPortalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  appointmentsBooked: number;
  prescriptionRefills: number;
  billPayments: number;
  labResultsViewed: number;
  averageSessionDuration: number;
  userEngagementByFeature: Array<{
    feature: string;
    users: number;
    usage: number;
  }>;
  registrationTrend: Array<{ month: string; registrations: number }>;
  activityTrend: Array<{ month: string; logins: number; actions: number }>;
  userSatisfaction: number;
  supportTickets: {
    total: number;
    resolved: number;
    pending: number;
    averageResolutionTime: number;
  };
}

class PatientPortalAnalyticsService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getPatientPortalAnalytics(params: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PatientPortalAnalyticsData> {
    await this.delay();
    return mockData as PatientPortalAnalyticsData;
  }
}

export const patientPortalAnalyticsService =
  new PatientPortalAnalyticsService();
