import { removeBackground } from "@imgly/background-removal";

export async function removeImageBackground(
  imageFile: File | Blob,
): Promise<Blob> {
  try {
    const result = await removeBackground(imageFile);
    return result;
  } catch (error) {
    console.error("Background removal failed:", error);
    throw new Error("Failed to remove background");
  }
}

export async function removeImageBackgroundFromBuffer(
  imageBuffer: Buffer,
): Promise<Buffer> {
  try {
    const blob = new Blob([imageBuffer]);
    const result = await removeBackground(blob);
    const arrayBuffer = await result.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Background removal failed:", error);
    throw new Error("Failed to remove background");
  }
}
