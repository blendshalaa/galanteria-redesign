/**
 * Client-side image compression for admin uploads.
 *
 * WHY THIS EXISTS
 * ---------------
 * The original uploader sent whatever file the user picked, untouched, straight
 * into Supabase Storage — and then rendered that same file inside a 300px grid
 * tile. The existing assets show where that leads: twelve of the product photos
 * in this repo are 7-8 MB JPEGs. A category page of twenty such products is a
 * ~150 MB page load.
 *
 * Compressing in the browser (rather than asking the client to remember to
 * resize photos first) is the only version of this that survives contact with
 * a real user. Every photo now becomes two WebP derivatives:
 *
 *   full  — max 1600px, quality 0.82 — the detail page and lightbox
 *   thumb — max  600px, quality 0.78 — every grid on the site
 *
 * An 8 MB camera JPEG typically lands around 180 KB / 35 KB.
 */

const FULL_MAX_EDGE = 1600;
const THUMB_MAX_EDGE = 600;
const FULL_QUALITY = 0.82;
const THUMB_QUALITY = 0.78;

/** Files above this are rejected before we even try to decode them. */
export const MAX_INPUT_BYTES = 25 * 1024 * 1024;

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/**
 * Load a File into something drawable. `createImageBitmap` is fast and off the
 * main thread where available; the <img> path is the Safari fallback.
 */
async function decode(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through — some browsers refuse certain colour profiles here.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Fotoja nuk mund të lexohej.'));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function scaledSize(width, height, maxEdge) {
  const longest = Math.max(width, height);
  // Never upscale — a 400px logo should stay 400px.
  if (longest <= maxEdge) return { width, height };
  const ratio = maxEdge / longest;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Kompresimi i fotos dështoi.'))),
      type,
      quality
    );
  });
}

async function render(source, maxEdge, quality) {
  const { width, height } = scaledSize(source.width, source.height, maxEdge);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  // Meaningfully better downscaling of detailed furniture textures.
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);

  let blob = await canvasToBlob(canvas, 'image/webp', quality);

  // Very old Safari ignores the requested type and hands back a PNG, which for
  // a photo is larger than the original. Fall back to JPEG in that case.
  if (blob.type !== 'image/webp') {
    blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  }

  return { blob, width, height };
}

/**
 * Validate + compress one File.
 *
 * @returns {Promise<{full: Blob, thumb: Blob, ext: string, width: number,
 *                    height: number, originalBytes: number, bytes: number}>}
 * @throws {Error} with a message already written in Albanian for the admin UI.
 */
export async function processImage(file) {
  if (!file) throw new Error('Asnjë skedar.');

  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error(`"${file.name}" nuk është foto e vlefshme (lejohen JPG, PNG, WEBP).`);
  }

  if (file.size > MAX_INPUT_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new Error(`"${file.name}" është ${mb}MB — maksimumi është 25MB.`);
  }

  const source = await decode(file);

  try {
    const [full, thumb] = await Promise.all([
      render(source, FULL_MAX_EDGE, FULL_QUALITY),
      render(source, THUMB_MAX_EDGE, THUMB_QUALITY),
    ]);

    return {
      full: full.blob,
      thumb: thumb.blob,
      ext: full.blob.type === 'image/webp' ? 'webp' : 'jpg',
      width: full.width,
      height: full.height,
      originalBytes: file.size,
      bytes: full.blob.size + thumb.blob.size,
    };
  } finally {
    // ImageBitmap holds decoded pixels; releasing matters when the client
    // drags in thirty photos at once.
    source.close?.();
  }
}

/** "8.2 MB" — for the upload progress readout. */
export function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
