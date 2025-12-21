/**
 * Upload Service
 *
 * Handles file uploads to the backend
 */

import axios from 'axios';
// @ts-ignore - JS module without types
import secureStorage from '../utils/secureStorage';

const UPLOAD_URL = 'https://backend.healthstack.africa/upload';

export interface UploadResponse {
  url: string;
  filename?: string;
  size?: number;
}

/**
 * Upload a base64 encoded file to the server
 *
 * @param base64Uri - Base64 encoded file data
 * @returns Promise with uploaded file URL
 */
export const uploadBase64File = async (
  base64Uri: string,
): Promise<UploadResponse> => {
  const token = secureStorage.getToken();

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await axios.post<UploadResponse>(
    UPLOAD_URL,
    { uri: base64Uri },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
};

/**
 * Upload a file directly
 *
 * @param file - File object to upload
 * @returns Promise with uploaded file URL
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const token = secureStorage.getToken();

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<UploadResponse>(UPLOAD_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Upload multiple files
 *
 * @param files - Array of files to upload
 * @returns Promise with array of uploaded file URLs
 */
export const uploadMultipleFiles = async (
  files: File[],
): Promise<UploadResponse[]> => {
  const uploadPromises = files.map((file) => uploadFile(file));
  return Promise.all(uploadPromises);
};
