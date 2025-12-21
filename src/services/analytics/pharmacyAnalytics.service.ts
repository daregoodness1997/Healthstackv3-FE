import mockData from './pharmacyAnalytics.mock.json';
import {
  AppointmentStat,
  StatusTimeline,
  DistributionData,
} from './appointmentAnalytics.service';

export interface PharmacyAnalyticsData {
  stats: AppointmentStat[];
  salesTimeline: StatusTimeline;
  drugCategoryDistribution: DistributionData;
  topSellingDrugs: DistributionData;
  prescriptionTypeDistribution: DistributionData;
  paymentMethodDistribution: DistributionData;
  stockLevelTrends: StatusTimeline;
  expiryAlerts: DistributionData;
  patientTypeDistribution: DistributionData;
  revenueByDepartment: DistributionData;
}

export interface PharmacyAnalyticsFilters {
  startDate?: string;
  endDate?: string;
  department?: string;
  timeRange?: string;
}

class PharmacyAnalyticsService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getStats(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<AppointmentStat[]> {
    await this.delay();
    return mockData.stats as AppointmentStat[];
  }

  async getSalesTimeline(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<StatusTimeline> {
    await this.delay();
    return mockData.salesTimeline as StatusTimeline;
  }

  async getDrugCategoryDistribution(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.drugCategoryDistribution as DistributionData;
  }

  async getTopSellingDrugs(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.topSellingDrugs as DistributionData;
  }

  async getPrescriptionTypeDistribution(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.prescriptionTypeDistribution as DistributionData;
  }

  async getPaymentMethodDistribution(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.paymentMethodDistribution as DistributionData;
  }

  async getStockLevelTrends(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<StatusTimeline> {
    await this.delay();
    return mockData.stockLevelTrends as StatusTimeline;
  }

  async getExpiryAlerts(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.expiryAlerts as DistributionData;
  }

  async getPatientTypeDistribution(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.patientTypeDistribution as DistributionData;
  }

  async getRevenueByDepartment(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<DistributionData> {
    await this.delay();
    return mockData.revenueByDepartment as DistributionData;
  }

  async getAllAnalytics(
    filters?: PharmacyAnalyticsFilters,
  ): Promise<PharmacyAnalyticsData> {
    await this.delay(800);
    return {
      stats: mockData.stats as AppointmentStat[],
      salesTimeline: mockData.salesTimeline as StatusTimeline,
      drugCategoryDistribution:
        mockData.drugCategoryDistribution as DistributionData,
      topSellingDrugs: mockData.topSellingDrugs as DistributionData,
      prescriptionTypeDistribution:
        mockData.prescriptionTypeDistribution as DistributionData,
      paymentMethodDistribution:
        mockData.paymentMethodDistribution as DistributionData,
      stockLevelTrends: mockData.stockLevelTrends as StatusTimeline,
      expiryAlerts: mockData.expiryAlerts as DistributionData,
      patientTypeDistribution:
        mockData.patientTypeDistribution as DistributionData,
      revenueByDepartment: mockData.revenueByDepartment as DistributionData,
    };
  }
}

export const pharmacyAnalyticsService = new PharmacyAnalyticsService();
