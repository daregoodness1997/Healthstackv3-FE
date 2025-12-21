// @ts-ignore - JS module
import client from '../feathers';
// @ts-ignore - JS module
import { secureStorage } from '../utils/secureStorage';

/**
 * Laboratory Service
 * Handles all API calls for Laboratory module
 */

// Types
export interface Laboratory {
  _id?: string;
  name: string;
  locationType: 'Laboratory';
  facility: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LabResult {
  _id?: string;
  clientId: string;
  billId: string;
  testName: string;
  result: string;
  referenceRange?: string;
  unit?: string;
  status?: 'pending' | 'completed' | 'reviewed';
  labTechnician?: string;
  reviewedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LabBill {
  _id?: string;
  clientId: string;
  laboratoryId: string;
  facilityId: string;
  items: Array<{
    testName: string;
    testCode: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Service references
const locationService = client.service('location');
const labResultsService = client.service('labresults');
const billsService = client.service('bills');
const orderService = client.service('order');
const inventoryService = client.service('inventory');

/**
 * Laboratory Location Operations
 */
export const laboratoryService = {
  // Get all laboratories for a facility
  async getLaboratories(facilityId: string, query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await locationService.find({
      query: {
        facility: facilityId,
        locationType: 'Laboratory',
        ...query,
      },
    });
  },

  // Get single laboratory by ID
  async getLaboratory(laboratoryId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await locationService.get(laboratoryId);
  },

  // Create new laboratory
  async createLaboratory(data: Omit<Laboratory, '_id'>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await locationService.create({
      ...data,
      locationType: 'Laboratory',
    });
  },

  // Update laboratory
  async updateLaboratory(laboratoryId: string, data: Partial<Laboratory>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await locationService.patch(laboratoryId, data);
  },

  // Delete laboratory
  async deleteLaboratory(laboratoryId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await locationService.remove(laboratoryId);
  },
};

/**
 * Lab Results Operations
 */
export const labResultsOperations = {
  // Get all lab results with optional filters
  async getLabResults(query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await labResultsService.find({ query });
  },

  // Get lab results for specific client
  async getClientLabResults(clientId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await labResultsService.find({
      query: {
        clientId,
        $sort: { createdAt: -1 },
      },
    });
  },

  // Get single lab result
  async getLabResult(resultId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await labResultsService.get(resultId);
  },

  // Create lab result
  async createLabResult(data: Omit<LabResult, '_id'>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await labResultsService.create(data);
  },

  // Update lab result
  async updateLabResult(resultId: string, data: Partial<LabResult>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await labResultsService.patch(resultId, data);
  },

  // Delete lab result
  async deleteLabResult(resultId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await labResultsService.remove(resultId);
  },
};

/**
 * Lab Bills Operations
 */
export const labBillsOperations = {
  // Get all lab bills
  async getLabBills(query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.find({ query });
  },

  // Get bills for specific laboratory
  async getLaboratoryBills(laboratoryId: string, query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.find({
      query: {
        laboratoryId,
        ...query,
      },
    });
  },

  // Get bills for specific client
  async getClientLabBills(clientId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.find({
      query: {
        clientId,
        billType: 'laboratory',
        $sort: { createdAt: -1 },
      },
    });
  },

  // Get single bill
  async getLabBill(billId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.get(billId);
  },

  // Create lab bill
  async createLabBill(data: Omit<LabBill, '_id'>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.create({
      ...data,
      billType: 'laboratory',
    });
  },

  // Update lab bill
  async updateLabBill(billId: string, data: Partial<LabBill>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.patch(billId, data);
  },

  // Delete lab bill
  async deleteLabBill(billId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.remove(billId);
  },
};

/**
 * Lab Orders Operations
 */
export const labOrdersOperations = {
  // Get lab orders
  async getLabOrders(query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await orderService.find({
      query: {
        orderType: 'laboratory',
        ...query,
      },
    });
  },

  // Update lab order
  async updateLabOrder(orderId: string, data: any) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await orderService.patch(orderId, data);
  },
};

/**
 * Lab Inventory Operations
 */
export const labInventoryOperations = {
  // Get lab inventory items
  async getLabInventory(laboratoryId: string, query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await inventoryService.find({
      query: {
        locationId: laboratoryId,
        ...query,
      },
    });
  },

  // Search inventory items
  async searchLabInventory(searchTerm: string, laboratoryId?: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    const query: any = {
      $or: [
        { productname: { $regex: searchTerm, $options: 'i' } },
        { productcode: { $regex: searchTerm, $options: 'i' } },
      ],
    };

    if (laboratoryId) {
      query.locationId = laboratoryId;
    }

    return await inventoryService.find({ query });
  },
};

// Export all services as a single object
export default {
  laboratory: laboratoryService,
  results: labResultsOperations,
  bills: labBillsOperations,
  orders: labOrdersOperations,
  inventory: labInventoryOperations,
};
