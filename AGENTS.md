# PFPGen - Professional Profile Picture Editor Build Guide

## 🎯 Project Overview

Create a professional-grade profile picture editor web application that allows users to upload images, remove backgrounds, apply professional editing tools, and download optimized profile pictures for social media platforms.

**Core User Journey:**
1. Upload image → 2. Remove background → 3. Apply professional edits → 4. Download optimized result

**Key Capabilities:**
- Intelligent background removal
- Professional image filters and adjustments  
- Shape cropping and social media templates
- Real-time preview and editing

---

## 🛠️ Technology Requirements

**Essential Stack:**
- **Framework**: Next.js 15 + TypeScript (full-stack solution)
- **Authentication**: Better Auth with Google OAuth integration
- **Image Processing**: Sharp library + Remove.bg API + Canvas manipulation
- **Real-time Editing**: Konva.js for interactive canvas preview
- **Database**: Neon PostgreSQL with Prisma ORM
- **Payment Processing**: Polar integration
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Deployment**: Vercel platform

---

## 🚀 Development Phases

### Phase 1: Foundation Setup (5-10 minutes)

**Environment Configuration:**
1. Initialize Next.js project with TypeScript
2. Install core dependencies for image processing, authentication, and UI components
3. Configure environment variables for external services
4. Set up database schema and authentication providers

**Key Dependencies to Install:**
- Core: `@prisma/client`, `prisma`, `@better-auth/core`, `@better-auth/prisma`
- Image Processing: `sharp`, `react-dropzone`, `@vercel/blob`, `axios`, `form-data`
- Canvas/Editing: `konva`, `react-konva`, `use-image`, `fabric`, `react-color`
- UI Components: All essential shadcn/ui components (buttons, cards, tabs, sliders, etc.)

### Phase 2: Backend Architecture

**Image Processing Pipeline:**
- Implement background removal using Remove.bg API integration
- Create advanced background replacement system (solid colors, gradients, patterns, custom images)
- Build comprehensive image adjustment engine (brightness, contrast, saturation, hue, sharpening, blur, gamma correction)
- Develop professional filter presets (vintage, dramatic, soft, black & white, warm, cool, professional)
- Design shape cropping system with custom SVG masks (circle, square, heart, star)
- Create social media template engine for platform-specific optimization

**Core Processing Functions Needed:**
- `removeBackground()` - API integration for background removal
- `addBackground()` - Advanced background replacement with multiple types
- `applyImageAdjustments()` - Comprehensive adjustment pipeline
- `applyFilter()` - Professional filter application
- `cropToShape()` - Custom shape cropping with SVG masks
- `applySocialTemplate()` - Platform-specific optimization

### Phase 3: Authentication & Database

**User Management System:**
- Configure Better Auth with Google OAuth provider
- Design minimal but effective database schema
- Implement user credit system (5 free images, unlimited for Pro users)
- Track processed images for user dashboard
- Set up session management and security

**Required Database Models:**
- User model with credits and plan tracking
- ProcessedImage model for user gallery
- Standard Better Auth models (Account, Session)

### Phase 4: Frontend Architecture

**Page Structure:**
- **Landing Page**: Hero section, feature showcase, authentication
- **Editor Page**: Upload interface, real-time editing canvas, tabbed controls
- **Dashboard**: User gallery, usage statistics, account management
- **Pricing**: Plan comparison and upgrade flow

**Editor Interface Design:**
- Upload area with drag-and-drop functionality
- Real-time canvas preview using Konva.js
- Tabbed editing panel:
  - Background tab: Color picker, gradient selector, pattern options
  - Adjustments tab: Sliders for all image parameters
  - Filters tab: Professional preset grid
  - Crop tab: Shape selection and social media templates
- Processing indicators and download options

### Phase 5: API Development

**Essential API Endpoints:**
- `/api/upload` - Image upload to blob storage
- `/api/process` - Main processing pipeline orchestration
- `/api/auth/[...better-auth]` - Authentication handling
- `/api/templates` - Social media template management

**Processing Pipeline Logic:**
- Accept image URL and processing operations array
- Execute operations in sequence (background removal → background addition → adjustments → filters → cropping)
- Return processed image URL and operation metadata

### Phase 6: Advanced UI Components

**Core Editor Component:**
- Interactive canvas with real-time preview
- State management for all editing parameters
- Operation queuing and processing status
- Download functionality with format options

**Professional Controls:**
- Custom slider components for precise adjustments
- Color picker with professional palette
- Filter preview grid with visual indicators
- Shape selection with visual guides
- Social media template selection with size badges

### Phase 7: Payment Integration

**Polar Integration:**
- Connect payment system to Better Auth
- Implement credit tracking and plan management
- Create upgrade flow for Pro features
- Handle payment webhooks and plan updates

### Phase 8: Deployment & Production

**Vercel Deployment:**
- Configure environment variables for production
- Set up Neon database connection
- Deploy with proper domain configuration
- Monitor performance and usage

---

## 📱 User Experience Flow

### Initial User Journey:
1. **Discovery**: User lands on homepage with clear value proposition
2. **Authentication**: Simple Google sign-in process
3. **First Use**: Upload image with guided onboarding
4. **Editing**: Intuitive tabbed interface with real-time preview
5. **Download**: Multiple format options with optimized results
6. **Return**: Dashboard shows previous work and encourages continued use

### Professional Editing Workflow:
1. **Upload**: Drag-and-drop or click to upload
2. **Background Removal**: Automatic processing with progress indicator
3. **Background Selection**: Choose from colors, gradients, or patterns
4. **Fine-tuning**: Adjust brightness, contrast, and other parameters
5. **Style Application**: Apply professional filters
6. **Shape & Platform**: Crop to desired shape and optimize for social platforms
7. **Export**: Download in preferred format

---

## 🎨 Feature Specification

### Background Processing:
- **Removal**: AI-powered background removal via Remove.bg API
- **Solid Colors**: Professional color palette with 32+ options
- **Gradients**: 6+ professional gradient presets
- **Patterns**: Geometric and organic pattern options
- **Custom Images**: Upload and blur custom backgrounds

### Image Adjustments:
- **Brightness**: -100 to +100 range with real-time preview
- **Contrast**: -100 to +100 range for dramatic effects
- **Saturation**: -100 to +100 for color intensity control
- **Hue**: 0-360 degrees for color shifting
- **Sharpening**: 0-10 scale for detail enhancement
- **Blur**: 0-10 scale for soft effects
- **Gamma**: 0.1-3.0 range for exposure correction

### Professional Filters:
- **None**: Original image
- **Professional**: Subtle enhancement for business use
- **Vintage**: Warm, nostalgic effect
- **Dramatic**: High contrast, cinematic look
- **Soft**: Gentle, dreamy appearance
- **Black & White**: Classic monochrome
- **Warm**: Orange/yellow tinting
- **Cool**: Blue/cyan tinting

### Shape Cropping:
- **Circle**: Perfect for most social platforms
- **Square**: Standard format option
- **Rounded Square**: Modern, friendly appearance
- **Heart**: Creative, personal use
- **Star**: Fun, attention-grabbing

### Social Media Templates:
- **LinkedIn**: Professional 400x400 with subtle styling
- **Instagram**: Square format with creative options
- **Twitter**: Optimized for profile display
- **Facebook**: Standard social media format
- **TikTok**: Modern, creative styling

---

## 🏆 Success Metrics

### Technical Performance:
- Image processing time under 10 seconds
- Real-time preview response under 200ms
- 99.9% uptime for processing pipeline
- Mobile-responsive design across all devices

### User Experience:
- Intuitive interface requiring no tutorial
- Professional results suitable for business use
- Export quality maintaining original resolution
- Smooth workflow from upload to download

### Business Objectives:
- Free tier drives user acquisition
- Pro conversion through advanced features
- Scalable architecture supporting growth
- Cost-effective image processing pipeline

This instruction-focused guide provides a clear roadmap for building a professional profile picture editor without getting bogged down in implementation details, allowing developers to focus on the strategic decisions and user experience priorities.
