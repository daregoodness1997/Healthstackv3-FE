import mockData from './pharmacyAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface PharmacyAnalyticsData {
  totalPrescriptions: number;
  totalRevenue: number;
  topSellingDrugs: Array<{ name: string; quantity: number; revenue: number }>;
  prescriptionsByStatus: Array<{ status: string; count: number }>;
  dailySales: Array<{ date: string; revenue: number }>;
  lowStockItems: Array<{ name: string; quantity: number }>;
  averageWaitTime?: number;
  dispensingRate?: number;
}

export const pharmacyAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<PharmacyAnalyticsData> {
    await delay(500);
    
    // Transform mock data to match the expected interface
    const stats = mockData.stats as any[];
    const topSellingData = mockData.topSellingDrugs as any;
    const salesData = mockData.salesTimeline as any;
    
    return {
      totalPrescriptions: parseInt(stats[1]?.value?.replace(/,/g, '') || '0'),
      totalRevenue: parseFloat(stats[0]?.value?.replace(/[₦,M]/g, '') || '0') * 1000000,
      topSellingDrugs: topSellingData.labels.map((name: string, i: number) => ({
        name,
        quantity: topSellingData.data[i],
        revenue: topSellingData.data[i] * 1000, // Estimated revenue
      })),
      prescriptionsByStatus: [
        { status: 'Completed', count: 4500 },
        { status: 'Pending', count: 980 },
        { status: 'Cancelled', count: 198 },
      ],
      dailySales: salesData.labels.map((date: string, i: number) => ({
        date,
        revenue: salesData.datasets[0].data[i],
      })),
      lowStockItems: [
        { name: 'Paracetamol', quantity: 15 },
        { name: 'Amoxicillin', quantity: 12 },
        { name: 'Ibuprofen', quantity: 8 },
      ],
      averageWaitTime: 25,
      dispensingRate: 94.5,
    };
  },
};
