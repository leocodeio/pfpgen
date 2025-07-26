# PFPGen - Professional Profile Picture Editor

A modern, AI-powered profile picture editor that removes backgrounds, applies professional filters, and optimizes images for social media platforms.

## ✨ Features

- **AI Background Removal** - Intelligent background removal using @imgly/background-removal or MediaPipe
- **Professional Editing** - Brightness, contrast, saturation, hue, sharpening, blur, gamma correction
- **Advanced Backgrounds** - Solid colors, gradients, patterns, custom images
- **Professional Filters** - 8 preset filters (vintage, dramatic, soft, B&W, warm, cool, professional)
- **Shape Cropping** - Circle, square, heart, star with custom SVG masks
- **Social Media Templates** - Optimized for LinkedIn, Instagram, Twitter, Facebook, TikTok
- **Real-time Preview** - Interactive canvas with live editing
- **Multiple Export Formats** - PNG, JPG, WebP with quality optimization

## 🛠️ Tech Stack

### **Core Framework**

```bash
# Full-stack React framework with TypeScript
Next.js 15 + TypeScript
```

### **Authentication**

```bash
# Modern authentication with OAuth providers
Better Auth + Google OAuth
```

### **Image Processing**

```bash
# Server-side image manipulation
Sharp                           # High-performance image processing
@imgly/background-removal       # Client-side AI background removal (free)
# OR MediaPipe Selfie Segmentation # Google's free background removal
# OR @tensorflow/tfjs + BodyPix   # TensorFlow.js background removal
axios                          # HTTP client for API calls
form-data                      # Multipart form data handling
```

### **Frontend Canvas & Editing**

```bash
# Interactive canvas and real-time editing
Konva.js           # 2D canvas library
react-konva        # React bindings for Konva
use-image          # React hook for image loading
fabric             # Advanced canvas manipulation
react-color        # Color picker components
react-dropzone     # Drag-and-drop file uploads
```

### **Database & ORM**

```bash
# PostgreSQL with modern ORM
Neon PostgreSQL    # Serverless PostgreSQL
Prisma ORM         # Type-safe database access
@prisma/client     # Prisma client library
```

### **File Storage**

```bash
# Serverless blob storage
@vercel/blob       # Vercel's blob storage solution
```

### **Payment Processing**

```bash
# Integrated payment solution
Polar              # Payment processing
@polar-sh/sdk      # Polar SDK for integration
```

### **UI Framework & Styling**

```bash
# Modern UI components and styling
shadcn/ui          # High-quality React components
Tailwind CSS       # Utility-first CSS framework
Lucide React       # Beautiful icons
clsx               # Conditional className utility
tailwind-merge     # Tailwind class merging
```

### **Development & Deployment**

```bash
# Development and production environment
Vercel             # Serverless deployment platform
TypeScript         # Type safety and developer experience
ESLint            # Code linting
Prettier          # Code formatting
```

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Vercel account for deployment
- Neon account for PostgreSQL database
- Google OAuth credentials
- Polar account for payments
- (Optional) Hugging Face API key for advanced background removal

### 1. Clone and Install

```bash
git clone https://github.com/leocodeio/pfpgen.git
cd pfpgen
npm install
```

### 2. Install Core Dependencies

```bash
# Authentication and database
npm install @prisma/client prisma @better-auth/core @better-auth/prisma

# Image processing
npm install sharp react-dropzone @vercel/blob axios form-data

# Background removal (choose one)
npm install @imgly/background-removal
# OR for MediaPipe
npm install @mediapipe/selfie_segmentation @mediapipe/camera_utils @mediapipe/control_utils @mediapipe/drawing_utils
# OR for TensorFlow.js
npm install @tensorflow/tfjs @tensorflow-models/body-pix

# Canvas and editing
npm install konva react-konva use-image fabric react-color

# UI utilities
npm install clsx tailwind-merge lucide-react

# Payment processing
npm install @polar-sh/sdk
```

### 3. Install shadcn/ui Components

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Install essential components
npx shadcn@latest add button input card dialog progress avatar
npx shadcn@latest add slider tabs separator tooltip badge
npx shadcn@latest add accordion alert-dialog select
```

### 4. Environment Variables

Create `.env.local` file:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Background Removal (optional - for advanced features)
HUGGING_FACE_API_KEY="your-hugging-face-api-key"

# File Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Payments
POLAR_ORGANIZATION_ID="your-polar-org-id"
POLAR_ACCESS_TOKEN="your-polar-access-token"

# App
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

### 6. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🏗️ Project Structure

```
pfpgen/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── upload/        # Image upload endpoint
│   │   │   ├── process/       # Image processing pipeline
│   │   │   └── templates/     # Social media templates
│   │   ├── editor/            # Image editor page
│   │   ├── dashboard/         # User dashboard
│   │   ├── pricing/           # Pricing page
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   └── editor/           # Editor-specific components
│   ├── lib/                  # Utility functions
│   │   ├── auth.ts           # Authentication configuration
│   │   ├── db.ts             # Database connection
│   │   ├── image-processor.ts # Image processing functions
│   │   └── utils.ts          # General utilities
│   └── types/                # TypeScript type definitions
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
└── package.json             # Dependencies and scripts
```

## 🔧 API Endpoints

### Image Processing

- `POST /api/upload` - Upload image to blob storage
- `POST /api/process` - Process image with multiple operations
- `GET /api/templates` - Get social media templates

### Authentication

- `POST /api/auth/signin` - Sign in with Google
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/session` - Get current session

### User Management

- `GET /api/user/credits` - Get user credits
- `POST /api/user/upgrade` - Upgrade to Pro plan

## 🎨 Key Features Implementation

### Background Removal

````typescript
## 🎨 Key Features Implementation

### Background Removal Options

#### Option 1: @imgly/background-removal (Recommended)
```typescript
// Client-side, free, no API key required
import { removeBackground } from '@imgly/background-removal';
const result = await removeBackground(imageBlob);
````

**Pros:** Free, client-side processing, no API limits, good quality
**Cons:** Larger bundle size, requires modern browsers

#### Option 2: MediaPipe Selfie Segmentation

```typescript
// Google's free solution, excellent for portraits
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
  },
});
```

**Pros:** Free, optimized for people, lightweight
**Cons:** Best for portraits only, requires setup

#### Option 3: TensorFlow.js BodyPix

```typescript
// Machine learning in the browser
import * as bodyPix from "@tensorflow-models/body-pix";
const net = await bodyPix.load();
const segmentation = await net.segmentPerson(image);
```

**Pros:** Free, open source, customizable
**Cons:** Requires ML knowledge, larger models

#### Option 4: Hugging Face API (Advanced)

```typescript
// For advanced users who want API-based solution
const response = await fetch(
  "https://api-inference.huggingface.co/models/briaai/RMBG-1.4",
  {
    headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}` },
    method: "POST",
    body: imageFile,
  }
);
```

**Pros:** High quality, server-side processing
**Cons:** Requires API key, rate limits on free tier

````

### Professional Filters

- Vintage, Dramatic, Soft, Black & White, Warm, Cool, Professional
- Applied using Sharp.js with custom filter presets

### Shape Cropping

- Circle, Square, Rounded Square, Heart, Star
- Custom SVG masks for precise shape cutting

### Social Media Optimization

- Platform-specific templates (LinkedIn, Instagram, Twitter, Facebook, TikTok)
- Optimized dimensions and styling for each platform

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
````

### Environment Setup

1. Configure environment variables in Vercel dashboard
2. Connect Neon PostgreSQL database
3. Set up custom domain (optional)
4. Configure background removal solution (client-side processing recommended)

## 💰 Pricing Tiers

### Free Tier

- 5 image processing credits
- Basic editing features
- Standard export formats

### Pro Tier ($9.99/month)

- Unlimited image processing
- Advanced editing features
- All export formats
- Priority processing

## 🔐 Security Features

- **Authentication**: Secure OAuth with Better Auth
- **API Protection**: Rate limiting and authentication checks
- **Data Privacy**: User data encrypted and securely stored
- **Payment Security**: PCI-compliant payment processing with Polar

## 📊 Performance Targets

- **Image Processing**: < 10 seconds per image
- **Real-time Preview**: < 200ms response time
- **Uptime**: 99.9% availability
- **Mobile Support**: Fully responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [PFPGen Docs](https://pfpgen-docs.vercel.app)
- **Issues**: [GitHub Issues](https://github.com/leocodeio/pfpgen/issues)
- **Discussions**: [GitHub Discussions](https://github.com/leocodeio/pfpgen/discussions)

## 🙏 Acknowledgments

- [@imgly/background-removal](https://github.com/imgly/background-removal-js) for client-side AI background removal
- [MediaPipe](https://mediapipe.dev/) by Google for selfie segmentation
- [TensorFlow.js](https://www.tensorflow.org/js) for machine learning in browsers
- [Sharp.js](https://sharp.pixelplumbing.com) for image processing
- [Konva.js](https://konvajs.org) for canvas manipulation
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Better Auth](https://better-auth.com) for authentication
- [Polar](https://polar.sh) for payment processing

---

Built with ❤️ for professional profile picture creation
