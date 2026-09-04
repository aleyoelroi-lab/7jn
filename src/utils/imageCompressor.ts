/**
 * Universal dynamic client-side image downscaler.
 * Re-samples high-definition camera photographs or graphics down to a compact 450px threshold.
 * This guarantees the image fits well within local storage constraints and doesn't exceed QuotaExceededError limits.
 */
export function compressImage(file: File, maxDimension: number = 250, quality: number = 0.60): Promise<string> {
  return new Promise((resolve, reject) => {
    const isImageFile = file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(file.name);
    if (!isImageFile) {
      reject(new Error("Selected file is not recognized as an image. Supported files: JPG, PNG, WEBP, GIF, SVG, etc."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Maintain original aspect ratio while ensuring boundaries
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to configure 2D resampling memory buffer."));
          return;
        }

        // Clean & smooth drawing parameters
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized PNG
        const compressedBase64 = canvas.toDataURL("image/png");
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error("Failed to parse visual elements of the image."));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to load chosen file buffer."));
    reader.readAsDataURL(file);
  });
}
