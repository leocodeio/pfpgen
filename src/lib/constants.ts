// Essential constants for PFPGen application

export const APP_NAME = 'PFPGen';
export const APP_DESCRIPTION = 'Professional Profile Picture Generator';

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

// Image processing
export const MAX_IMAGE_DIMENSION = 2048;
export const THUMBNAIL_SIZE = 200;

// Social media dimensions
export const SOCIAL_MEDIA_SIZES = {
  linkedin: { width: 400, height: 400 },
  twitter: { width: 400, height: 400 },
  instagram: { width: 320, height: 320 },
  facebook: { width: 170, height: 170 },
  discord: { width: 128, height: 128 },
} as const;

// User plans
export const USER_PLANS = {
  FREE: {
    name: 'Free',
    credits: 10,
    features: ['Basic editing', 'Standard export', '5 templates'],
  },
  PRO: {
    name: 'Pro',
    credits: 100,
    features: ['Advanced editing', 'High-res export', 'All templates', 'Batch processing'],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    credits: 1000,
    features: ['All Pro features', 'API access', 'Custom templates', 'Priority support'],
  },
} as const;

// Canvas settings
export const CANVAS_CONFIG = {
  maxZoom: 5,
  minZoom: 0.25,
  defaultZoom: 1,
  debounceMs: 200,
} as const;
