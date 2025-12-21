import mockData from './inventoryAnalytics.mock.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface InventoryAnalyticsData {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  itemsByCategory: Array<{ category: string; count: number; value: number }>;
  expiringItems: Array<{ item: string; expiryDate: string; quantity: number }>;
  stockMovement?: Array<{ month: string; inward: number; outward: number }>;
}

export const inventoryAnalyticsService = {
  async getAnalytics(
    facilityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<InventoryAnalyticsData> {
    await delay(500);
    return mockData as InventoryAnalyticsData;
  },
};
