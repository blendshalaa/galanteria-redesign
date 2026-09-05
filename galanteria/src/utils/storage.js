import { supabase } from '../lib/supabase';
import { processImage } from './imageProcessing';

/**
 * Supabase Storage helpers shared by every admin uploader.
 *
 * Two problems this fixes, both present in all three original uploaders
 * (AdminProducts, AdminProjects, AdminHero):
 *
 * 1. ORPHANED FILES. They uploaded on file-select, before the record was
 *    saved. Closing the modal or pressing "Anulo" left the files in the bucket
 *    forever with nothing referencing them — invisible, unbillable-to-anyone
 *    storage growth with no cleanup path. Callers now stage files locally and
 *    call `uploadImages` at save time, and `removeByUrls` on cancel.
 *
 * 2. SWALLOWED ERRORS. Every uploader was `if (!error) { ...use it... }` with
 *    no else branch, so a failed upload silently did nothing at all. These
 *    functions throw, and report per-file failures.
 */

export const BUCKET = 'galanteria-images';

/** Storage path from a public URL, or null if the URL is not ours. */
export function pathFromPublicUrl(url) {
  if (typeof url !== 'string') return null;
  const marker = `/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const path = url.slice(index + marker.length).split('?')[0];
  return path ? decodeURIComponent(path) : null;
}

function randomName(ext) {
  const random =
    globalThis.crypto?.randomUUID?.().slice(0, 12) ??
    Math.random().toString(36).slice(2, 14);
  return `${Date.now()}-${random}.${ext}`;
}

async function uploadBlob(path, blob) {
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: '31536000', // immutable: filenames are unique, so cache hard
    upsert: false,
    contentType: blob.type,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Compress and upload a batch of Files.
 *
 * Never throws for a single bad file — a failure in photo 7 of 10 should not
 * discard the other nine. Returns both outcomes and lets the caller decide.
 *
 * @param {File[]} files
 * @param {string} folder            e.g. 'products' | 'projects' | 'hero'
 * @param {(p: {done: number, total: number, name: string}) => void} [onProgress]
 * @returns {Promise<{uploaded: Array<{url: string, thumbUrl: string}>,
 *                    failed: Array<{name: string, message: string}>,
 *                    savedBytes: number}>}
 */
export async function uploadImages(files, folder, onProgress) {
  const uploaded = [];
  const failed = [];
  let originalTotal = 0;
  let finalTotal = 0;

  let done = 0;
  for (const file of files) {
    onProgress?.({ done, total: files.length, name: file.name });

    // Track what we wrote for this one file, so a half-finished upload
    // (full succeeded, thumb failed) does not leave a stray object behind.
    const writtenPaths = [];

    try {
      const processed = await processImage(file);

      const base = randomName(processed.ext);
      const fullPath = `${folder}/${base}`;
      const thumbPath = `${folder}/thumbs/${base}`;

      const url = await uploadBlob(fullPath, processed.full);
      writtenPaths.push(fullPath);

      const thumbUrl = await uploadBlob(thumbPath, processed.thumb);
      writtenPaths.push(thumbPath);

      uploaded.push({ url, thumbUrl });
      originalTotal += processed.originalBytes;
      finalTotal += processed.bytes;
    } catch (error) {
      if (writtenPaths.length) {
        await supabase.storage.from(BUCKET).remove(writtenPaths).catch(() => {});
      }
      failed.push({ name: file.name, message: error?.message || 'Ngarkimi dështoi.' });
    }

    done += 1;
    onProgress?.({ done, total: files.length, name: file.name });
  }

  return { uploaded, failed, savedBytes: Math.max(0, originalTotal - finalTotal) };
}

/**
 * Delete storage objects given their public URLs. Non-throwing on purpose:
 * this runs on cancel and on delete, where failing loudly would block the user
 * from an action that has already conceptually happened.
 */
export async function removeByUrls(urls) {
  const paths = (urls || []).map(pathFromPublicUrl).filter(Boolean);
  if (!paths.length) return { removed: 0 };

  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) {
    console.error('[Galanteria] Failed to remove storage objects', paths, error);
    return { removed: 0, error };
  }
  return { removed: paths.length };
}

/**
 * Every storage object belonging to a record: full images plus thumbnails.
 * Used when deleting a product so its files go with it.
 */
export function allImageUrls(record) {
  return [...(record?.images || []), ...(record?.thumbnails || [])].filter(Boolean);
}
