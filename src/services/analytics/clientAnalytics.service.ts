import mockData from './clientAnalytics.mock.json';
import {
  AppointmentStat,
  StatusTimeline,
  DistributionData,
} from './appointmentAnalytics.service';

export interface ClientAnalyticsData {
  stats: AppointmentStat[];
  registrationTimeline: StatusTimeline;
  ageDistribution: DistributionData;
  genderDistribution: DistributionData;
  maritalStatus: DistributionData;
  clientLocation: DistributionData;
  religionDistribution: DistributionData;
  professionDistribution: DistributionData;
  clientType: DistributionData;
  clientStatus: DistributionData;
}

export interface ClientAnalyticsFilters {
  startDate?: string;
  endDate?: string;
  department?: string;
  timeRange?: string;
}

class ClientAnalyticsService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getStats(filters?: ClientAnalyticsFilters): Promise<AppointmentStat[]> {
    await this.delay();
    return mockData.stats as AppointmentStat[];
  }

  async getRegistrationTimeline(
    filters?: ClientAnalyticsFilters,
  ): Promise<StatusTimeline> {
    await this.delay();
    return mockData.registrationTimeline as StatusTimeline;
  }

  async getAgeDistribution(
    filters?: ClientAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.ageDistribution as DistributionData;
  }

  async getGenderDistribution(
    filters?: ClientAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.genderDistribution as DistributionData;
  }

  async getMaritalStatus(
    filters?: ClientAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.maritalStatus as DistributionData;
  }

  async getClientLocation(
    filters?: ClientAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.clientLocation as DistributionData;
  }

  async getReligionDistribution(
    filters?: ClientAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.religionDistribution as DistributionData;
  }

  async getProfessionDistribution(
    filters?: ClientAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.professionDistribution as DistributionData;
  }

  async getClientType(
    filters?: ClientAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.clientType as DistributionData;
  }

  async getClientStatus(
    filters?: ClientAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.clientStatus as DistributionData;
  }

  async getAllAnalytics(
    filters?: ClientAnalyticsFilters,
  ): Promise<ClientAnalyticsData> {
    await this.delay(800);
    return {
      stats: mockData.stats as AppointmentStat[],
      registrationTimeline: mockData.registrationTimeline as StatusTimeline,
      ageDistribution: mockData.ageDistribution as DistributionData,
      genderDistribution: mockData.genderDistribution as DistributionData,
      maritalStatus: mockData.maritalStatus as DistributionData,
      clientLocation: mockData.clientLocation as DistributionData,
      religionDistribution: mockData.religionDistribution as DistributionData,
      professionDistribution:
        mockData.professionDistribution as DistributionData,
      clientType: mockData.clientType as DistributionData,
      clientStatus: mockData.clientStatus as DistributionData,
    };
  }
}

export const clientAnalyticsService = new ClientAnalyticsService();
