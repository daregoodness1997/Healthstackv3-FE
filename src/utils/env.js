// Utility to get Paystack public key from environment
export const getPaystackPublicKey = () => {
  const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  if (!key) {
    console.error('VITE_PAYSTACK_PUBLIC_KEY is not defined in .env.local');
    return '';
  }

  return key;
};

// Utility to get backend API URL
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8080';
};

// Utility to get upload URL
export const getUploadUrl = () => {
  return (
    import.meta.env.VITE_UPLOAD_URL ||
    import.meta.env.VITE_API_URL + 'upload' ||
    'http://localhost:8080/upload'
  );
};

// Utility to get frontend app URL
export const getAppUrl = () => {
  return import.meta.env.VITE_APP_URL || 'http://localhost:5173';
};

// Utility to get citizen app URL
export const getCitizenAppUrl = () => {
  return import.meta.env.VITE_CITIZEN_APP_URL || 'http://localhost:5174';
};

// Utility to get Google Maps API key
export const getGoogleMapsApiKey = () => {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
};

// Utility to get PureLife API URL
export const getPurelifeApiUrl = () => {
  return (
    import.meta.env.VITE_PURELIFE_API_URL ||
    'https://python-api.purelifehealth.io'
  );
};

// Utility to get SNOMED API URL
export const getSnomedApiUrl = () => {
  return (
    import.meta.env.VITE_SNOMED_API_URL ||
    'https://browser.ihtsdotools.org/snowstorm/snomed-ct'
  );
};
