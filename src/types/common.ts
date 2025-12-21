/**
 * Common Type Definitions
 */

export interface Location {
  _id: string;
  name: string;
  locationType: string;
  facility: string;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityDetail {
  _id: string;
  facilityName: string;
  facilityType?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Employee {
  _id: string;
  firstname: string;
  lastname: string;
  facility: string;
  facilityDetail: FacilityDetail;
  locations: Location[];
}

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  imageurl?: string;
  currentEmployee: Employee;
}

export interface PaginationParams {
  limit?: number;
  skip?: number;
  page?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}

export interface ApiError {
  message: string;
  code?: number;
  errors?: Record<string, string[]>;
}
