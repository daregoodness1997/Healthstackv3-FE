import { uploadFile } from '../../utils/secureHttp';
import { getUploadUrl as getUploadUrlEnv } from '../../utils/env';

/**
 * Upload file and get URL
 * @param {string} file - File URI/base64
 * @returns {Promise<string>} Upload URL
 */
export const getUploadUrl = async (file) => {
  // console.log(file);

  const formData = new FormData();
  formData.append('uri', file);

  const response = await uploadFile(getUploadUrlEnv(), { uri: file });
  //console.log(response);
  return response.data.url;
};
