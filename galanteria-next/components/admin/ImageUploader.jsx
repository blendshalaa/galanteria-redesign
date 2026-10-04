'use client';

import { useEffect, useRef, useState } from 'react';
import { Spinner } from '@/components/ui/states';
import { ACCEPTED_TYPES, formatBytes } from '@/utils/imageProcessing';
import { field } from './ui';
import { cn } from '@/lib/cn';

/**
 * Image picker for the admin forms.
 *
 * The uploaders this replaces — one copy each in the products, projects and
 * hero screens — uploaded straight to Supabase Storage the moment a file was
 * selected, before the record was saved. Closing the modal or pressing "Anulo"
 * left those files in the bucket permanently, referenced by nothing.
 *
 * Here files are *staged* locally with object-URL previews and the parent
 * uploads them at save time. Nothing reaches the bucket for a record that is
 * never saved.
 *
 * Also new: drag-to-reorder. The first image is the thumbnail used in every
 * grid on the site and in the admin table, and there was previously no way to
 * change which one that is short of deleting and re-uploading in order.
 */
export default function ImageUploader({
  existing = [], // [{ url, thumbUrl }] already in storage
  staged = [], // File[] picked but not yet uploaded
  onChangeExisting,
  onChangeStaged,
  uploading = false,
  progress = null, // { done, total, name }
  label = 'Fotot',
  hint = 'PNG, JPG, WEBP — kompresohen automatikisht',
}) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [previews, setPreviews] = useState([]);

  // Object URLs must be revoked or the tab leaks memory when the client picks
  // thirty photos, changes their mind, and picks thirty more.
  useEffect(() => {
    const urls = staged.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [staged]);

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((file) => ACCEPTED_TYPES.includes(file.type));
    if (files.length) onChangeStaged([...staged, ...files]);
  };

  /* Reordering applies to already-uploaded images; staged files are appended
     after them in the order they were picked. */
  const onCardDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...existing];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    onChangeExisting(next);
    setDragIndex(null);
  };

  const makeCover = (index) => {
    if (index === 0) return;
    const next = [...existing];
    const [moved] = next.splice(index, 1);
    onChangeExisting([moved, ...next]);
  };

  const total = existing.length + staged.length;

  return (
    <div className={field.group}>
      <label className={field.label}>
        {label} ({total})
      </label>

      <div
        role="button"
        tabIndex={0}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          addFiles(event.dataTransfer.files);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && fileRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            fileRef.current?.click();
          }
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed',
          'px-6 py-10 text-center text-base text-ink-muted transition-colors duration-150',
          dragOver ? 'border-accent bg-accent-dim' : 'border-line bg-page/40 hover:border-line-hover'
        )}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = '';
          }}
          className="hidden"
        />

        {uploading ? (
          <>
            <Spinner size={24} />
            <p>
              Duke ngarkuar{progress ? ` ${progress.done}/${progress.total}` : ''}...
              {progress?.name && (
                <>
                  <br />
                  <small className="text-sm">{progress.name}</small>
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>
              <span className="font-semibold text-accent">Kliko për të ngarkuar</span> ose tërhiq fotot këtu
              <br />
              <small className="text-sm">{hint}</small>
            </p>
          </>
        )}
      </div>

      {total > 0 && (
        <>
          <p className={field.hint}>Tërhiq fotot për t’i renditur. Fotoja e parë përdoret si kopertinë.</p>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2.5">
            {existing.map((image, index) => (
              <div
                key={image.url}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onCardDrop(index)}
                className={cn(
                  'group relative aspect-square cursor-grab overflow-hidden rounded-lg border bg-page/60',
                  index === 0 ? 'border-accent' : 'border-line'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.thumbUrl || image.url} alt="" className="size-full object-cover" />

                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-accent px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#16120c]">
                    Kopertina
                  </span>
                )}

                <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {index !== 0 && (
                    <button type="button" onClick={() => makeCover(index)} title="Bëje kopertinë" className={previewButton}>
                      ★
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onChangeExisting(existing.filter((_, i) => i !== index))}
                    title="Hiq"
                    className={cn(previewButton, 'text-red-300')}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {staged.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-lg border border-dashed border-accent/50 bg-page/60"
              >
                {previews[index] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previews[index]} alt="" className="size-full object-cover opacity-80" />
                )}
                <span className="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-1 text-center text-[0.62rem] text-ink-soft">
                  {formatBytes(file.size)} → e re
                </span>
                <div className="absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={() => onChangeStaged(staged.filter((_, i) => i !== index))}
                    title="Hiq"
                    className={cn(previewButton, 'text-red-300')}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const previewButton =
  'flex size-6.5 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-black/60 text-xs text-ink backdrop-blur-sm transition-colors hover:bg-black/80';
