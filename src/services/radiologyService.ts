// @ts-ignore - JS module
import client from '../feathers';
// @ts-ignore - JS module
import { secureStorage } from '../utils/secureStorage';

/**
 * Radiology Service
 * Handles all API calls for Radiology module
 */

// Types
export interface Radiology {
  _id?: string;
  name: string;
  locationType: 'Radiology';
  facility: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RadiologyReport {
  _id?: string;
  clientId: string;
  billId: string;
  studyType: string;
  findings: string;
  impression?: string;
  recommendations?: string;
  status?: 'pending' | 'completed' | 'reviewed';
  radiologist?: string;
  reviewedBy?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RadiologyRequest {
  _id?: string;
  clientId: string;
  facilityId: string;
  radiologyId: string;
  requestType: string;
  clinicalInfo?: string;
  urgency?: 'routine' | 'urgent' | 'stat';
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface RadiologyBill {
  _id?: string;
  clientId: string;
  radiologyId: string;
  facilityId: string;
  items: Array<{
    studyName: string;
    studyCode: string;
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
const clinicalDocumentService = client.service('clinicaldocument');
const billsService = client.service('bills');
const orderService = client.service('order');
const notificationService = client.service('notification');

/**
 * Radiology Location Operations
 */
export const radiologyService = {
  // Get all radiologies for a facility
  async getRadiologies(facilityId: string, query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await locationService.find({
      query: {
        facility: facilityId,
        locationType: 'Radiology',
        ...query,
      },
    });
  },

  // Get single radiology by ID
  async getRadiology(radiologyId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await locationService.get(radiologyId);
  },

  // Create new radiology
  async createRadiology(data: Omit<Radiology, '_id'>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await locationService.create({
      ...data,
      locationType: 'Radiology',
    });
  },

  // Update radiology
  async updateRadiology(radiologyId: string, data: Partial<Radiology>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await locationService.patch(radiologyId, data);
  },

  // Delete radiology
  async deleteRadiology(radiologyId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await locationService.remove(radiologyId);
  },
};

/**
 * Radiology Reports Operations
 */
export const radiologyReportsOperations = {
  // Get all radiology reports with optional filters
  async getRadiologyReports(query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.find({
      query: {
        documentType: 'radiology-report',
        ...query,
      },
    });
  },

  // Get reports for specific client
  async getClientRadiologyReports(clientId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.find({
      query: {
        clientId,
        documentType: 'radiology-report',
        $sort: { createdAt: -1 },
      },
    });
  },

  // Get single radiology report
  async getRadiologyReport(reportId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.get(reportId);
  },

  // Create radiology report
  async createRadiologyReport(data: Omit<RadiologyReport, '_id'>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.create({
      ...data,
      documentType: 'radiology-report',
    });
  },

  // Update radiology report
  async updateRadiologyReport(
    reportId: string,
    data: Partial<RadiologyReport>,
  ) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.patch(reportId, data);
  },

  // Delete radiology report
  async deleteRadiologyReport(reportId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.remove(reportId);
  },
};

/**
 * Radiology Requests Operations
 */
export const radiologyRequestsOperations = {
  // Get all radiology requests
  async getRadiologyRequests(query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.find({
      query: {
        documentType: 'radiology-request',
        ...query,
      },
    });
  },

  // Get requests for specific client
  async getClientRadiologyRequests(clientId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.find({
      query: {
        clientId,
        documentType: 'radiology-request',
        $sort: { createdAt: -1 },
      },
    });
  },

  // Get single radiology request
  async getRadiologyRequest(requestId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.get(requestId);
  },

  // Create radiology request
  async createRadiologyRequest(data: Omit<RadiologyRequest, '_id'>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.create({
      ...data,
      documentType: 'radiology-request',
    });
  },

  // Update radiology request
  async updateRadiologyRequest(
    requestId: string,
    data: Partial<RadiologyRequest>,
  ) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.patch(requestId, data);
  },

  // Delete radiology request
  async deleteRadiologyRequest(requestId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await clinicalDocumentService.remove(requestId);
  },
};

/**
 * Radiology Bills Operations
 */
export const radiologyBillsOperations = {
  // Get all radiology bills
  async getRadiologyBills(query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.find({ query });
  },

  // Get bills for specific radiology
  async getRadiologyLocationBills(radiologyId: string, query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.find({
      query: {
        radiologyId,
        ...query,
      },
    });
  },

  // Get bills for specific client
  async getClientRadiologyBills(clientId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.find({
      query: {
        clientId,
        billType: 'radiology',
        $sort: { createdAt: -1 },
      },
    });
  },

  // Get single bill
  async getRadiologyBill(billId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.get(billId);
  },

  // Create radiology bill
  async createRadiologyBill(data: Omit<RadiologyBill, '_id'>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.create({
      ...data,
      billType: 'radiology',
    });
  },

  // Update radiology bill
  async updateRadiologyBill(billId: string, data: Partial<RadiologyBill>) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.patch(billId, data);
  },

  // Delete radiology bill
  async deleteRadiologyBill(billId: string) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await billsService.remove(billId);
  },
};

/**
 * Radiology Orders Operations
 */
export const radiologyOrdersOperations = {
  // Get radiology orders
  async getRadiologyOrders(query = {}) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await orderService.find({
      query: {
        orderType: 'radiology',
        ...query,
      },
    });
  },

  // Update radiology order
  async updateRadiologyOrder(orderId: string, data: any) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await orderService.patch(orderId, data);
  },
};

/**
 * Notifications Operations
 */
export const radiologyNotificationsOperations = {
  // Send notification
  async sendNotification(data: any) {
    const token = secureStorage.getToken();
    if (!token) throw new Error('Authentication required');

    return await notificationService.create(data);
  },
};

// Export all services as a single object
export default {
  radiology: radiologyService,
  reports: radiologyReportsOperations,
  requests: radiologyRequestsOperations,
  bills: radiologyBillsOperations,
  orders: radiologyOrdersOperations,
  notifications: radiologyNotificationsOperations,
};
