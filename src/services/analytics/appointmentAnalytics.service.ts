import mockData from './appointmentAnalytics.mock.json';

export interface AppointmentStat {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
}

export interface TimelineDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

export interface StatusTimeline {
  labels: string[];
  datasets: TimelineDataset[];
}

export interface DistributionData {
  labels: string[];
  data: number[];
  colors: string[];
  total?: number;
  change?: number;
}

export interface AppointmentAnalyticsData {
  stats: AppointmentStat[];
  statusTimeline: StatusTimeline;
  ageDistribution: DistributionData;
  genderDistribution: DistributionData;
  maritalStatus: DistributionData;
  appointmentLocation: DistributionData;
  religionDistribution: DistributionData;
  professionDistribution: DistributionData;
  appointmentType: DistributionData;
  appointmentClass: DistributionData;
}

export interface AppointmentAnalyticsFilters {
  startDate?: string;
  endDate?: string;
  department?: string;
  timeRange?: string;
}

class AppointmentAnalyticsService {
  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getStats(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<AppointmentStat[]> {
    await this.delay();
    // In real implementation, apply filters to query
    return mockData.stats as AppointmentStat[];
  }

  async getStatusTimeline(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<StatusTimeline> {
    await this.delay();
    return mockData.statusTimeline as StatusTimeline;
  }

  async getAgeDistribution(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.ageDistribution as DistributionData;
  }

  async getGenderDistribution(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.genderDistribution as DistributionData;
  }

  async getMaritalStatus(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.maritalStatus as DistributionData;
  }

  async getAppointmentLocation(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.appointmentLocation as DistributionData;
  }

  async getReligionDistribution(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.religionDistribution as DistributionData;
  }

  async getProfessionDistribution(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.professionDistribution as DistributionData;
  }

  async getAppointmentType(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.appointmentType as DistributionData;
  }

  async getAppointmentClass(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.appointmentClass as DistributionData;
  }

  async getAllAnalytics(
    filters?: AppointmentAnalyticsFilters,
  ): Promise<AppointmentAnalyticsData> {
    await this.delay(800);
    return {
      stats: mockData.stats as AppointmentStat[],
      statusTimeline: mockData.statusTimeline as StatusTimeline,
      ageDistribution: mockData.ageDistribution as DistributionData,
      genderDistribution: mockData.genderDistribution as DistributionData,
      maritalStatus: mockData.maritalStatus as DistributionData,
      appointmentLocation: mockData.appointmentLocation as DistributionData,
      religionDistribution: mockData.religionDistribution as DistributionData,
      professionDistribution:
        mockData.professionDistribution as DistributionData,
      appointmentType: mockData.appointmentType as DistributionData,
      appointmentClass: mockData.appointmentClass as DistributionData,
    };
  }
}

export const appointmentAnalyticsService = new AppointmentAnalyticsService();
