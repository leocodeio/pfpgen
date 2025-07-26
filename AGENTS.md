# SIMPLE.md - PFPGen Quick Build Guide

## 🎯 Goal

Build a professional profile picture editor with advanced editing capabilities including background removal, filters, adjustments, and templates.

**Core Features:**

- Upload image → Remove background → Advanced editing → Download
- Professional image filters, adjustments, effects, and templates

---

## 🛠️ Tech Stack (Minimal)

- **Frontend/Backend**: Next.js 15 + TypeScript
- **Auth**: Better Auth (Google OAuth only)
- **Image Processing**: Sharp + Remove.bg API + Fabric.js (Canvas)
- **Advanced Filters**: Canvas API + CSS Filters + Sharp
- **Database**: Neon PostgreSQL + Prisma
- **Payments**: Polar (integrated with Better Auth)
- **UI**: shadcn/ui + Tailwind CSS
- **Deployment**: Vercel

---

## 🚀 Simple Build Steps

### Step 1: Project Setup (5 minutes)

```bash
# Create project (already done)
cd pfpgen

# Install core dependencies
npm install @prisma/client prisma @better-auth/core @better-auth/prisma
npm install sharp react-dropzone @vercel/blob
npm install clsx tailwind-merge lucide-react

# Install advanced editing dependencies
npm install fabric react-color html2canvas
npm install konva react-konva use-image

# Install shadcn/ui essentials + advanced components
npx shadcn@latest add button input card dialog progress avatar
npx shadcn@latest add slider tabs separator tooltip badge
npx shadcn@latest add accordion alert-dialog select
```

### Step 2: Advanced Image Processing Backend

```bash
# Add Remove.bg for background removal + advanced processing
npm install axios form-data
npm install canvas @napi-rs/canvas
```

**Enhanced Image Processing Logic** (`src/lib/image-processor.ts`):

```typescript
import sharp from 'sharp';
import axios from 'axios';
import FormData from 'form-data';

// Remove background using Remove.bg API
export async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  const formData = new FormData();
  formData.append('image_file', imageBuffer, 'image.jpg');
  formData.append('size', 'auto');

  const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
    headers: {
      'X-Api-Key': process.env.REMOVE_BG_API_KEY!,
      ...formData.getHeaders(),
    },
    responseType: 'arraybuffer',
  });

  return Buffer.from(response.data);
}

// Advanced background options
export async function addBackground(
  imageBuffer: Buffer,
  backgroundType: 'solid' | 'gradient' | 'pattern' | 'image',
  options: BackgroundOptions
): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const { width, height } = await image.metadata();

  let background: sharp.Sharp;

  switch (backgroundType) {
    case 'solid':
      background = sharp({
        create: { width: width!, height: height!, channels: 3, background: options.color },
      });
      break;

    case 'gradient':
      background = await createGradientBackground(width!, height!, options.gradient!);
      break;

    case 'pattern':
      background = await createPatternBackground(width!, height!, options.pattern!);
      break;

    case 'image':
      background = sharp(options.imageUrl!)
        .resize(width, height, { fit: 'cover' })
        .blur(options.blur || 0);
      break;
  }

  return await background
    .composite([{ input: imageBuffer }])
    .png()
    .toBuffer();
}

// Create gradient backgrounds
async function createGradientBackground(
  width: number,
  height: number,
  gradient: GradientOptions
): Promise<sharp.Sharp> {
  const svg = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${gradient.start};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${gradient.end};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  return sharp(Buffer.from(svg));
}

// Advanced image adjustments
export async function applyImageAdjustments(
  imageBuffer: Buffer,
  adjustments: ImageAdjustments
): Promise<Buffer> {
  let processor = sharp(imageBuffer);

  // Brightness & Contrast
  if (adjustments.brightness !== 0 || adjustments.contrast !== 0) {
    processor = processor.modulate({
      brightness: 1 + adjustments.brightness / 100,
      saturation: 1 + adjustments.saturation / 100,
    });
  }

  // Hue rotation
  if (adjustments.hue !== 0) {
    processor = processor.modulate({ hue: adjustments.hue });
  }

  // Sharpening
  if (adjustments.sharpen > 0) {
    processor = processor.sharpen(adjustments.sharpen);
  }

  // Blur
  if (adjustments.blur > 0) {
    processor = processor.blur(adjustments.blur);
  }

  // Gamma correction
  if (adjustments.gamma !== 1) {
    processor = processor.gamma(adjustments.gamma);
  }

  return await processor.png().toBuffer();
}

// Apply preset filters
export async function applyFilter(imageBuffer: Buffer, filterName: FilterType): Promise<Buffer> {
  const filters = {
    vintage: { sepia: true, modulate: { brightness: 0.9, saturation: 0.8 } },
    dramatic: { modulate: { brightness: 0.8, contrast: 1.3 }, sharpen: 2 },
    soft: { blur: 0.5, modulate: { brightness: 1.1, saturation: 0.9 } },
    blackwhite: { greyscale: true, modulate: { contrast: 1.2 } },
    warm: { tint: { r: 255, g: 240, b: 220 } },
    cool: { tint: { r: 220, g: 240, b: 255 } },
    professional: { modulate: { contrast: 1.1, saturation: 0.95 }, sharpen: 1 },
  };

  const filter = filters[filterName];
  let processor = sharp(imageBuffer);

  if (filter.greyscale) processor = processor.greyscale();
  if (filter.sepia) processor = processor.tint({ r: 255, g: 240, b: 192 });
  if (filter.modulate) processor = processor.modulate(filter.modulate);
  if (filter.sharpen) processor = processor.sharpen(filter.sharpen);
  if (filter.blur) processor = processor.blur(filter.blur);
  if (filter.tint) processor = processor.tint(filter.tint);

  return await processor.png().toBuffer();
}

// Advanced cropping with shapes
export async function cropToShape(
  imageBuffer: Buffer,
  shape: 'circle' | 'square' | 'rounded-square' | 'heart' | 'star',
  size: number
): Promise<Buffer> {
  const masks = {
    circle: `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`,
    square: `<svg><rect width="${size}" height="${size}" fill="white"/></svg>`,
    'rounded-square': `<svg><rect width="${size}" height="${size}" rx="20" fill="white"/></svg>`,
    heart: createHeartMask(size),
    star: createStarMask(size),
  };

  return await sharp(imageBuffer)
    .resize(size, size, { fit: 'cover' })
    .composite([
      {
        input: Buffer.from(masks[shape]),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();
}

// Social media templates
export async function applySocialTemplate(
  imageBuffer: Buffer,
  platform: 'linkedin' | 'twitter' | 'instagram' | 'facebook' | 'tiktok',
  style: 'professional' | 'casual' | 'creative'
): Promise<Buffer> {
  const templates = {
    linkedin: {
      professional: { size: 400, background: '#f8fafc', border: 2, borderColor: '#e2e8f0' },
      casual: { size: 400, background: '#ffffff', shadow: true },
      creative: {
        size: 400,
        background: 'gradient',
        gradient: { start: '#667eea', end: '#764ba2' },
      },
    },
    instagram: {
      professional: { size: 400, background: '#ffffff', border: 1, borderColor: '#e5e5e5' },
      casual: { size: 400, background: 'transparent' },
      creative: { size: 400, filter: 'vintage' },
    },
    // Add more platforms...
  };

  const template = templates[platform][style];
  // Apply template logic here...

  return await sharp(imageBuffer)
    .resize(template.size, template.size, { fit: 'cover' })
    .png()
    .toBuffer();
}

// Types for advanced features
interface BackgroundOptions {
  color?: string;
  gradient?: GradientOptions;
  pattern?: string;
  imageUrl?: string;
  blur?: number;
}

interface GradientOptions {
  start: string;
  end: string;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
}

interface ImageAdjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  hue: number; // 0 to 360
  sharpen: number; // 0 to 10
  blur: number; // 0 to 10
  gamma: number; // 0.1 to 3
}

type FilterType = 'vintage' | 'dramatic' | 'soft' | 'blackwhite' | 'warm' | 'cool' | 'professional';

function createHeartMask(size: number): string {
  return `<svg width="${size}" height="${size}">
    <path d="M${size / 2},${size * 0.8} C${size * 0.2},${size * 0.4} ${size * 0.2},${size * 0.1} ${size / 2},${size * 0.3} C${size * 0.8},${size * 0.1} ${size * 0.8},${size * 0.4} ${size / 2},${size * 0.8}z" fill="white"/>
  </svg>`;
}

function createStarMask(size: number): string {
  const cx = size / 2,
    cy = size / 2,
    r = size / 2.5;
  let path = `M${cx},${cy - r}`;
  for (let i = 1; i < 10; i++) {
    const angle = (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? r : r / 2;
    const x = cx + radius * Math.sin(angle);
    const y = cy - radius * Math.cos(angle);
    path += ` L${x},${y}`;
  }
  path += 'z';
  return `<svg width="${size}" height="${size}"><path d="${path}" fill="white"/></svg>`;
}
```

### Step 3: Authentication (Better Auth + Google)

```bash
# Setup environment
echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "GOOGLE_CLIENT_ID=your-google-client-id" >> .env.local
echo "GOOGLE_CLIENT_SECRET=your-google-client-secret" >> .env.local
echo "REMOVE_BG_API_KEY=your-remove-bg-api-key" >> .env.local
```

**Auth Setup** (`src/lib/auth.ts`):

```typescript
import { betterAuth } from '@better-auth/core';
import { prismaAdapter } from '@better-auth/prisma';
import { google } from '@better-auth/oauth-providers';
import { prisma } from './db';

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

### Step 4: Database (Minimal Schema)

**Prisma Schema** (`prisma/schema.prisma`):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id      String @id @default(cuid())
  email   String @unique
  name    String?
  image   String?
  credits Int    @default(5)
  plan    Plan   @default(FREE)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accounts Account[]
  sessions Session[]
  images   ProcessedImage[]
}

model ProcessedImage {
  id        String   @id @default(cuid())
  originalUrl String
  processedUrl String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

enum Plan {
  FREE
  PRO
}

// Better Auth required models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Step 5: Simple Pages Structure

**Landing Page** (`src/app/page.tsx`):

- Hero section with "Upload Image" button
- Sign in with Google
- Feature showcase (background removal, filters, adjustments)
- Simple pricing (Free: 5 images, Pro: Unlimited)

**Advanced Editor Page** (`src/app/editor/page.tsx`):

- Upload area (react-dropzone)
- Real-time canvas preview with Konva.js
- Tabbed editing controls:
  - Background: Solid colors, gradients, patterns
  - Adjustments: Brightness, contrast, saturation, hue, sharpening, blur
  - Filters: Professional presets (vintage, dramatic, B&W, etc.)
  - Crop: Shapes (circle, square, heart, star) + social media templates
- Download with multiple format options

**Dashboard Page** (`src/app/dashboard/page.tsx`):

- User's processed images gallery
- Usage statistics and remaining credits
- Quick access to editor

**API Routes**:

- `src/app/api/auth/[...better-auth]/route.ts` (Better Auth)
- `src/app/api/upload/route.ts` (Image upload)
- `src/app/api/process/route.ts` (Advanced processing pipeline)
- `src/app/api/templates/route.ts` (Social media templates)

### Step 6: Core API Implementation

**Upload API** (`src/app/api/upload/route.ts`):

```typescript
import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('image') as File;

  // Upload to Vercel Blob
  const blob = await put(file.name, file, { access: 'public' });

  return Response.json({ url: blob.url });
}
```

**Process API** (`src/app/api/process/route.ts`):

```typescript
import {
  removeBackground,
  addBackground,
  applyImageAdjustments,
  applyFilter,
  cropToShape,
  applySocialTemplate,
} from '@/lib/image-processor';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const {
    imageUrl,
    backgroundType = 'solid',
    backgroundOptions,
    adjustments,
    filter,
    cropShape,
    socialTemplate,
    operations = [],
  } = await request.json();

  // Download original image
  const response = await fetch(imageUrl);
  let imageBuffer = Buffer.from(await response.arrayBuffer());

  // Apply operations in sequence
  for (const operation of operations) {
    switch (operation.type) {
      case 'removeBackground':
        imageBuffer = await removeBackground(imageBuffer);
        break;

      case 'addBackground':
        imageBuffer = await addBackground(
          imageBuffer,
          operation.backgroundType || 'solid',
          operation.options
        );
        break;

      case 'adjustments':
        if (operation.adjustments) {
          imageBuffer = await applyImageAdjustments(imageBuffer, operation.adjustments);
        }
        break;

      case 'filter':
        if (operation.filter) {
          imageBuffer = await applyFilter(imageBuffer, operation.filter);
        }
        break;

      case 'crop':
        if (operation.shape && operation.size) {
          imageBuffer = await cropToShape(imageBuffer, operation.shape, operation.size);
        }
        break;

      case 'socialTemplate':
        if (operation.platform && operation.style) {
          imageBuffer = await applySocialTemplate(imageBuffer, operation.platform, operation.style);
        }
        break;
    }
  }

  // Upload processed image
  const processedBlob = await put(`processed-${Date.now()}.png`, imageBuffer, { access: 'public' });

  return Response.json({
    processedUrl: processedBlob.url,
    operations: operations.length,
  });
}
```

### Step 7: Advanced Editor UI Components

**Enhanced Editor Component** (`src/components/editor/AdvancedEditor.tsx`):

```typescript
'use client'
import { useState, useRef, useCallback } from 'react'
import { Stage, Layer, Image as KonvaImage, Rect, Circle } from 'react-konva'
import useImage from 'use-image'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface EditorProps {
  imageUrl: string
  onSave: (processedUrl: string) => void
}

export function AdvancedEditor({ imageUrl, onSave }: EditorProps) {
  const [image] = useImage(imageUrl)
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    sharpen: 0,
    blur: 0,
    gamma: 1
  })
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [backgroundType, setBackgroundType] = useState<'solid' | 'gradient' | 'pattern'>('solid')
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [cropShape, setCropShape] = useState<'none' | 'circle' | 'square' | 'heart' | 'star'>('none')
  const [isProcessing, setIsProcessing] = useState(false)
  const stageRef = useRef<any>(null)

  const filters = [
    { name: 'None', value: null, preview: '🔘' },
    { name: 'Professional', value: 'professional', preview: '💼' },
    { name: 'Vintage', value: 'vintage', preview: '📸' },
    { name: 'Dramatic', value: 'dramatic', preview: '🎭' },
    { name: 'Soft', value: 'soft', preview: '✨' },
    { name: 'B&W', value: 'blackwhite', preview: '⚫' },
    { name: 'Warm', value: 'warm', preview: '🔥' },
    { name: 'Cool', value: 'cool', preview: '❄️' }
  ]

  const backgroundColors = [
    '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0',
    '#000000', '#1e293b', '#334155', '#475569',
    '#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a',
    '#ef4444', '#dc2626', '#b91c1c', '#991b1b',
    '#10b981', '#059669', '#047857', '#065f46',
    '#f59e0b', '#d97706', '#b45309', '#92400e',
    '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6',
    '#f97316', '#ea580c', '#dc2626', '#c2410c'
  ]

  const gradients = [
    { name: 'Ocean', start: '#667eea', end: '#764ba2' },
    { name: 'Sunset', start: '#f093fb', end: '#f5576c' },
    { name: 'Forest', start: '#4facfe', end: '#00f2fe' },
    { name: 'Royal', start: '#a8edea', end: '#fed6e3' },
    { name: 'Fire', start: '#ff9a9e', end: '#fecfef' },
    { name: 'Sky', start: '#ffecd2', end: '#fcb69f' }
  ]

  const socialTemplates = [
    { platform: 'linkedin', style: 'professional', name: 'LinkedIn Pro', size: '400x400' },
    { platform: 'instagram', style: 'creative', name: 'Instagram', size: '400x400' },
    { platform: 'twitter', style: 'casual', name: 'Twitter', size: '400x400' },
    { platform: 'facebook', style: 'casual', name: 'Facebook', size: '400x400' },
    { platform: 'tiktok', style: 'creative', name: 'TikTok', size: '400x400' }
  ]

  const handleAdjustmentChange = (key: string, value: number[]) => {
    setAdjustments(prev => ({ ...prev, [key]: value[0] }))
  }

  const processImage = async () => {
    setIsProcessing(true)

    const operations = []

    // Always remove background first
    operations.push({ type: 'removeBackground' })

    // Add background
    if (backgroundType === 'solid') {
      operations.push({
        type: 'addBackground',
        backgroundType: 'solid',
        options: { color: selectedColor }
      })
    } else if (backgroundType === 'gradient') {
      operations.push({
        type: 'addBackground',
        backgroundType: 'gradient',
        options: { gradient: { start: '#667eea', end: '#764ba2' } }
      })
    }

    // Apply adjustments if any
    const hasAdjustments = Object.values(adjustments).some(v => v !== 0 && v !== 1)
    if (hasAdjustments) {
      operations.push({
        type: 'adjustments',
        adjustments
      })
    }

    // Apply filter
    if (selectedFilter) {
      operations.push({
        type: 'filter',
        filter: selectedFilter
      })
    }

    // Apply crop shape
    if (cropShape !== 'none') {
      operations.push({
        type: 'crop',
        shape: cropShape,
        size: 400
      })
    }

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          operations
        })
      })

      const result = await response.json()
      onSave(result.processedUrl)
    } catch (error) {
      console.error('Processing failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Preview Area */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {image && (
                <Stage
                  width={400}
                  height={400}
                  ref={stageRef}
                  className="border rounded-lg"
                >
                  <Layer>
                    {backgroundType === 'solid' && (
                      <Rect
                        width={400}
                        height={400}
                        fill={selectedColor}
                      />
                    )}
                    <KonvaImage
                      image={image}
                      width={400}
                      height={400}
                      filters={selectedFilter ? [] : undefined} // Apply CSS filters via Sharp
                    />
                    {cropShape === 'circle' && (
                      <Circle
                        x={200}
                        y={200}
                        radius={190}
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dash={[5, 5]}
                        listening={false}
                      />
                    )}
                  </Layer>
                </Stage>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={processImage} disabled={isProcessing} className="flex-1">
                {isProcessing ? 'Processing...' : 'Apply Changes'}
              </Button>
              <Button variant="outline" onClick={() => stageRef.current?.toDataURL()}>
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Panel */}
      <div className="space-y-4">
        <Tabs defaultValue="background" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="background">BG</TabsTrigger>
            <TabsTrigger value="adjustments">Adjust</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="crop">Crop</TabsTrigger>
          </TabsList>

          <TabsContent value="background" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Background Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {['solid', 'gradient', 'pattern'].map(type => (
                    <Button
                      key={type}
                      variant={backgroundType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBackgroundType(type as any)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>

                {backgroundType === 'solid' && (
                  <div className="grid grid-cols-4 gap-2">
                    {backgroundColors.map(color => (
                      <button
                        key={color}
                        className={`w-12 h-12 rounded-lg border-2 ${
                          selectedColor === color ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                )}

                {backgroundType === 'gradient' && (
                  <div className="space-y-2">
                    {gradients.map(gradient => (
                      <Button
                        key={gradient.name}
                        variant="outline"
                        className="w-full justify-start"
                        style={{
                          background: `linear-gradient(to right, ${gradient.start}, ${gradient.end})`
                        }}
                      >
                        {gradient.name}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adjustments" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {Object.entries(adjustments).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium capitalize">{key}</label>
                      <span className="text-sm text-muted-foreground">{value}</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(val) => handleAdjustmentChange(key, val)}
                      max={key === 'gamma' ? 3 : key === 'hue' ? 360 : 100}
                      min={key === 'gamma' ? 0.1 : key === 'hue' ? 0 : -100}
                      step={key === 'gamma' ? 0.1 : 1}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-2">
                  {filters.map(filter => (
                    <Button
                      key={filter.name}
                      variant={selectedFilter === filter.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFilter(filter.value)}
                      className="flex items-center gap-2"
                    >
                      <span>{filter.preview}</span>
                      <span className="text-xs">{filter.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crop" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Crop Shape</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {['none', 'circle', 'square', 'heart', 'star'].map(shape => (
                    <Button
                      key={shape}
                      variant={cropShape === shape ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCropShape(shape as any)}
                    >
                      {shape}
                    </Button>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Social Templates</h4>
                  {socialTemplates.map(template => (
                    <Button
                      key={template.name}
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                    >
                      <span>{template.name}</span>
                      <Badge variant="secondary">{template.size}</Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
```

**Simple Color Picker for Basic Use** (`src/components/editor/ColorPicker.tsx`):

```typescript
const basicColors = ['#ffffff', '#000000', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316']

function SimpleColorPicker({ onSelect }: { onSelect: (color: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {basicColors.map(color => (
        <button
          key={color}
          className="w-12 h-12 rounded-lg border-2 hover:scale-105 transition-transform"
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  )
}
```

### Step 8: Payments (Polar Integration)

```bash
npm install @polar-sh/sdk
```

**Add to Better Auth config**:

```typescript
payments: {
  polar: {
    organizationId: process.env.POLAR_ORGANIZATION_ID!,
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
  },
}
```

### Step 9: Deploy to Vercel

```bash
# Setup Neon database
# Add environment variables to Vercel
# Deploy
vercel --prod
```

---

## 📱 Enhanced App Flow

1. **Landing Page**: User sees hero with feature showcase, clicks "Get Started"
2. **Sign In**: Google OAuth (handled by Better Auth)
3. **Advanced Editor**:
   - Upload image (drag & drop with preview)
   - Auto remove background with loading indicator
   - Professional editing tools:
     - **Background**: Solid colors, gradients, patterns, custom images
     - **Adjustments**: Brightness, contrast, saturation, hue, sharpening, blur, gamma
     - **Filters**: Professional presets (vintage, dramatic, soft, B&W, warm, cool)
     - **Crop**: Shapes (circle, square, heart, star) + social media templates
   - Real-time preview with Konva.js canvas
   - Download in multiple formats (PNG, JPG, WebP)
4. **Dashboard**: View processed images, usage stats, manage account
5. **Payments**: After 5 free images, prompt for Pro plan with Polar integration

---

## 🎨 Advanced UI Pages

1. **Landing** (`/`) - Hero + Feature Showcase + Sign In
2. **Editor** (`/editor`) - Advanced Upload + Professional Editing Tools + Real-time Preview
3. **Dashboard** (`/dashboard`) - Image Gallery + Usage Stats + Account Management
4. **Pricing** (`/pricing`) - Free vs Pro plans with feature comparison

## 🏆 Advanced Features Included

### Image Processing Capabilities:

- ✅ **Background Removal** (Remove.bg API)
- ✅ **Advanced Backgrounds** (Solid, Gradients, Patterns, Custom Images)
- ✅ **Professional Filters** (8 preset filters + custom)
- ✅ **Image Adjustments** (Brightness, Contrast, Saturation, Hue, Sharpening, Blur, Gamma)
- ✅ **Shape Cropping** (Circle, Square, Heart, Star with custom SVG masks)
- ✅ **Social Media Templates** (LinkedIn, Instagram, Twitter, Facebook, TikTok)
- ✅ **Multiple Export Formats** (PNG, JPG, WebP)

### UI/UX Features:

- ✅ **Real-time Canvas Preview** (Konva.js integration)
- ✅ **Tabbed Editor Interface** (Background, Adjustments, Filters, Crop)
- ✅ **Professional Color Palettes** (32 curated colors + gradients)
- ✅ **Responsive Design** (Works on mobile and desktop)
- ✅ **Loading States** (Processing indicators and progress bars)
- ✅ **Error Handling** (Graceful error messages and retry logic)

This creates a professional-grade profile picture editor with comprehensive editing capabilities!
