import mockData from './clinicAnalytics.mock.json';
import {
  AppointmentStat,
  StatusTimeline,
  DistributionData,
} from './appointmentAnalytics.service';

export interface ClinicAnalyticsData {
  stats: AppointmentStat[];
  consultationTimeline: StatusTimeline;
  diagnosisDistribution: DistributionData;
  departmentDistribution: DistributionData;
  patientTypeDistribution: DistributionData;
  consultationTypeDistribution: DistributionData;
  vitalSignsTrends: StatusTimeline;
  waitTimeDistribution: DistributionData;
  doctorPerformance: DistributionData;
  outcomeDistribution: DistributionData;
}

export interface ClinicAnalyticsFilters {
  startDate?: string;
  endDate?: string;
  department?: string;
  timeRange?: string;
}

class ClinicAnalyticsService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getStats(filters?: ClinicAnalyticsFilters): Promise<AppointmentStat[]> {
    await this.delay();
    return mockData.stats as AppointmentStat[];
  }

  async getConsultationTimeline(
    filters?: ClinicAnalyticsFilters,
  ): Promise<StatusTimeline> {
    await this.delay();
    return mockData.consultationTimeline as StatusTimeline;
  }

  async getDiagnosisDistribution(
    filters?: ClinicAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.diagnosisDistribution as DistributionData;
  }

  async getDepartmentDistribution(
    filters?: ClinicAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.departmentDistribution as DistributionData;
  }

  async getPatientTypeDistribution(
    filters?: ClinicAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.patientTypeDistribution as DistributionData;
  }

  async getConsultationTypeDistribution(
    filters?: ClinicAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.consultationTypeDistribution as DistributionData;
  }

  async getVitalSignsTrends(
    filters?: ClinicAnalyticsFilters,
  ): Promise<StatusTimeline> {
    await this.delay();
    return mockData.vitalSignsTrends as StatusTimeline;
  }

  async getWaitTimeDistribution(
    filters?: ClinicAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.waitTimeDistribution as DistributionData;
  }

  async getDoctorPerformance(
    filters?: ClinicAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.doctorPerformance as DistributionData;
  }

  async getOutcomeDistribution(
    filters?: ClinicAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.outcomeDistribution as DistributionData;
  }

  async getAllAnalytics(
    filters?: ClinicAnalyticsFilters,
  ): Promise<ClinicAnalyticsData> {
    await this.delay(800);
    return {
      stats: mockData.stats as AppointmentStat[],
      consultationTimeline: mockData.consultationTimeline as StatusTimeline,
      diagnosisDistribution: mockData.diagnosisDistribution as DistributionData,
      departmentDistribution:
        mockData.departmentDistribution as DistributionData,
      patientTypeDistribution:
        mockData.patientTypeDistribution as DistributionData,
      consultationTypeDistribution:
        mockData.consultationTypeDistribution as DistributionData,
      vitalSignsTrends: mockData.vitalSignsTrends as StatusTimeline,
      waitTimeDistribution: mockData.waitTimeDistribution as DistributionData,
      doctorPerformance: mockData.doctorPerformance as DistributionData,
      outcomeDistribution: mockData.outcomeDistribution as DistributionData,
    };
  }
}

export const clinicAnalyticsService = new ClinicAnalyticsService();
