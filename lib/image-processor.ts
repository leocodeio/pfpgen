import sharp from "sharp";

export interface ImageAdjustments {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  sharpening?: number;
  blur?: number;
  gamma?: number;
}

export interface FilterOptions {
  name:
    | "none"
    | "professional"
    | "vintage"
    | "dramatic"
    | "soft"
    | "blackwhite"
    | "warm"
    | "cool";
}

export interface BackgroundOptions {
  type: "color" | "gradient" | "pattern" | "image";
  value: string;
  blur?: number;
}

export interface ShapeOptions {
  shape: "circle" | "square" | "rounded-square" | "heart" | "star";
  size: number;
}

export interface SocialTemplate {
  platform: "linkedin" | "instagram" | "twitter" | "facebook" | "tiktok";
  width: number;
  height: number;
}

export async function applyImageAdjustments(
  imageBuffer: Buffer,
  adjustments: ImageAdjustments,
): Promise<Buffer> {
  let processor = sharp(imageBuffer);

  if (adjustments.brightness !== undefined) {
    processor = processor.modulate({
      brightness: 1 + adjustments.brightness / 100,
    });
  }

  if (adjustments.contrast !== undefined) {
    const factor =
      (259 * (adjustments.contrast + 255)) /
      (255 * (259 - adjustments.contrast));
    processor = processor.linear(factor, -(128 * factor) + 128);
  }

  if (adjustments.saturation !== undefined) {
    processor = processor.modulate({
      saturation: 1 + adjustments.saturation / 100,
    });
  }

  if (adjustments.hue !== undefined) {
    processor = processor.modulate({ hue: adjustments.hue });
  }

  if (adjustments.gamma !== undefined) {
    processor = processor.gamma(adjustments.gamma);
  }

  if (adjustments.blur && adjustments.blur > 0) {
    processor = processor.blur(adjustments.blur);
  }

  if (adjustments.sharpening && adjustments.sharpening > 0) {
    processor = processor.sharpen({ sigma: adjustments.sharpening / 2 });
  }

  return processor.png().toBuffer();
}

export async function applyFilter(
  imageBuffer: Buffer,
  filter: FilterOptions,
): Promise<Buffer> {
  let processor = sharp(imageBuffer);

  switch (filter.name) {
    case "professional":
      processor = processor
        .modulate({ brightness: 1.05, saturation: 0.95 })
        .sharpen({ sigma: 0.5 });
      break;

    case "vintage":
      processor = processor
        .modulate({ brightness: 0.9, saturation: 0.8, hue: 20 })
        .tint({ r: 255, g: 220, b: 177 });
      break;

    case "dramatic":
      processor = processor
        .modulate({ brightness: 0.95, saturation: 1.2 })
        .linear(1.2, -25);
      break;

    case "soft":
      processor = processor
        .modulate({ brightness: 1.1, saturation: 0.85 })
        .blur(0.3);
      break;

    case "blackwhite":
      processor = processor.greyscale();
      break;

    case "warm":
      processor = processor.tint({ r: 255, g: 230, b: 200 });
      break;

    case "cool":
      processor = processor.tint({ r: 200, g: 230, b: 255 });
      break;

    case "none":
    default:
      break;
  }

  return processor.png().toBuffer();
}

export async function addBackground(
  imageBuffer: Buffer,
  background: BackgroundOptions,
  width: number,
  height: number,
): Promise<Buffer> {
  let backgroundLayer: Buffer;

  switch (background.type) {
    case "color":
      backgroundLayer = await sharp({
        create: {
          width,
          height,
          channels: 3,
          background: background.value,
        },
      })
        .png()
        .toBuffer();
      break;

    case "gradient":
      backgroundLayer = await createGradientBackground(
        width,
        height,
        background.value,
      );
      break;

    case "pattern":
      backgroundLayer = await createPatternBackground(
        width,
        height,
        background.value,
      );
      break;

    case "image":
      backgroundLayer = await sharp(background.value)
        .resize(width, height, { fit: "cover" })
        .blur(background.blur || 0)
        .png()
        .toBuffer();
      break;

    default:
      throw new Error("Invalid background type");
  }

  return sharp(backgroundLayer)
    .composite([
      {
        input: imageBuffer,
        blend: "over",
      },
    ])
    .png()
    .toBuffer();
}

export async function cropToShape(
  imageBuffer: Buffer,
  shape: ShapeOptions,
): Promise<Buffer> {
  const { width, height } = await sharp(imageBuffer).metadata();
  const size = Math.min(width || shape.size, height || shape.size, shape.size);

  let maskSvg: string;

  switch (shape.shape) {
    case "circle":
      maskSvg = `<svg width="${size}" height="${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
      </svg>`;
      break;

    case "square":
      maskSvg = `<svg width="${size}" height="${size}">
        <rect width="${size}" height="${size}" fill="white"/>
      </svg>`;
      break;

    case "rounded-square":
      const radius = size * 0.1;
      maskSvg = `<svg width="${size}" height="${size}">
        <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/>
      </svg>`;
      break;

    case "heart":
      maskSvg = `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
        <path d="M50,25 C50,15 30,5 20,25 C10,45 50,85 50,85 C50,85 90,45 80,25 C70,5 50,15 50,25 Z" fill="white"/>
      </svg>`;
      break;

    case "star":
      maskSvg = `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
        <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="white"/>
      </svg>`;
      break;

    default:
      throw new Error("Invalid shape");
  }

  const mask = Buffer.from(maskSvg);

  return sharp(imageBuffer)
    .resize(size, size, { fit: "cover", position: "center" })
    .composite([
      {
        input: mask,
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
}

export async function applySocialTemplate(
  imageBuffer: Buffer,
  template: SocialTemplate,
): Promise<Buffer> {
  const templates = {
    linkedin: { width: 400, height: 400, style: "professional" },
    instagram: { width: 400, height: 400, style: "creative" },
    twitter: { width: 400, height: 400, style: "clean" },
    facebook: { width: 400, height: 400, style: "social" },
    tiktok: { width: 400, height: 400, style: "modern" },
  };

  const config = templates[template.platform];

  return sharp(imageBuffer)
    .resize(config.width, config.height, {
      fit: "cover",
      position: "center",
    })
    .png()
    .toBuffer();
}

async function createGradientBackground(
  width: number,
  height: number,
  gradient: string,
): Promise<Buffer> {
  const svg = `<svg width="${width}" height="${height}">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        ${gradient}
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
  </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function createPatternBackground(
  width: number,
  height: number,
  pattern: string,
): Promise<Buffer> {
  let svg: string;

  switch (pattern) {
    case "dots":
      svg = `<svg width="${width}" height="${height}">
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2" fill="#e0e0e0"/>
        </pattern>
        <rect width="100%" height="100%" fill="white"/>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>`;
      break;

    case "lines":
      svg = `<svg width="${width}" height="${height}">
        <pattern id="lines" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <line x1="0" y1="10" x2="20" y2="10" stroke="#e0e0e0" stroke-width="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="white"/>
        <rect width="100%" height="100%" fill="url(#lines)"/>
      </svg>`;
      break;

    default:
      svg = `<svg width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="white"/>
      </svg>`;
  }

  return sharp(Buffer.from(svg)).png().toBuffer();
}
