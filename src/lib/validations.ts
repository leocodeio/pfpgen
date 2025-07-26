import { z } from 'zod';

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/heic'].includes(file.type),
      'File must be a valid image (JPEG, PNG, WebP, or HEIC)'
    ),
});

// User profile validation
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
});

// Image metadata validation
export const imageMetadataSchema = z.object({
  originalName: z.string(),
  mimeType: z.string(),
  fileSize: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
});

// Editor configuration validation
export const editorConfigSchema = z.object({
  // Background
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  backgroundType: z.enum(['solid', 'gradient', 'pattern', 'blur']),

  // Filters
  brightness: z.number().min(-50).max(50),
  contrast: z.number().min(-50).max(50),
  saturation: z.number().min(-50).max(50),
  warmth: z.number().min(-50).max(50),

  // Transform
  scale: z.number().min(0.5).max(2),
  rotation: z.number().min(-45).max(45),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),

  // Effects
  shadow: z.object({
    enabled: z.boolean(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i),
    blur: z.number().min(0).max(50),
    offsetX: z.number().min(-50).max(50),
    offsetY: z.number().min(-50).max(50),
    opacity: z.number().min(0).max(1),
  }),

  border: z.object({
    enabled: z.boolean(),
    width: z.number().min(0).max(20),
    color: z.string().regex(/^#[0-9A-F]{6}$/i),
    radius: z.number().min(0).max(50),
  }),

  // PFP specific
  cropShape: z.enum(['circle', 'square', 'rounded']),
  faceDetection: z.boolean(),
  autoCenter: z.boolean(),
});

// Template validation
export const templateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['PROFESSIONAL', 'CREATIVE', 'SOCIAL', 'BUSINESS', 'CASUAL']),
  config: editorConfigSchema,
  isPublic: z.boolean().default(false),
});

// API response validation
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type FileUpload = z.infer<typeof fileUploadSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type ImageMetadata = z.infer<typeof imageMetadataSchema>;
export type EditorConfig = z.infer<typeof editorConfigSchema>;
export type Template = z.infer<typeof templateSchema>;
export type ApiResponse<T = unknown> = z.infer<typeof apiResponseSchema> & { data?: T };
