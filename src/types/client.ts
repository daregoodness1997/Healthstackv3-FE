/**
 * Client Type Definitions
 * 
 * TypeScript interfaces for Client module
 */

export interface Client {
  _id: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  dob: string;
  phone: string;
  email?: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalstatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  residentialaddress?: string;
  town?: string;
  lga?: string;
  state?: string;
  country?: string;
  nextofkin?: string;
  address?: string;
  nextofkinphone?: string;
  mrn?: string;
  religion?: string;
  profession?: string;
  clientTags?: string[];
  bloodgroup?: string;
  genotype?: string;
  disabilities?: string;
  allergies?: string[];
  comorbidities?: string[];
  specificDetails?: string;
  nok_name?: string;
  nok_phoneno?: string;
  nok_relationship?: string;
  facility: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDTO
  extends Omit<Client, '_id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateClientDTO extends Partial<CreateClientDTO> {
  _id: string;
}

export interface ClientQueryParams {
  facilityId?: string;
  search?: string;
  gender?: string;
  status?: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClientListResponse {
  total: number;
  limit: number;
  skip: number;
  data: Client[];
}
