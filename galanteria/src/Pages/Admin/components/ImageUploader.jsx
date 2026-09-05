import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../../../Components/ui';
import { ACCEPTED_TYPES, formatBytes } from '../../../utils/imageProcessing';

/**
 * Image picker for the admin forms.
 *
 * The old uploaders (one copy each in AdminProducts, AdminProjects and
 * AdminHero) uploaded straight to Supabase Storage the moment a file was
 * selected — before the record was saved. Closing the modal or pressing
 * "Anulo" left those files in the bucket permanently, referenced by nothing.
 *
 * Here, files are *staged* locally with object-URL previews. The parent
 * uploads them at save time via utils/storage.js#uploadImages. Nothing reaches
 * the bucket for a record that is never saved.
 *
 * Also new: drag-to-reorder. The first image is the thumbnail used in every
 * grid on the site and in the admin table, so which one comes first matters —
 * and there was previously no way to change it short of deleting and
 * re-uploading in a different order.
 */
const ImageUploader = ({
  existing = [],       // [{ url, thumbUrl }] already in storage
  staged = [],         // File[] picked but not yet uploaded
  onChangeExisting,
  onChangeStaged,
  uploading = false,
  progress = null,     // { done, total, name }
  label = 'Fotot',
  hint = 'PNG, JPG, WEBP — kompresohen automatikisht',
}) => {
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
    const files = Array.from(fileList || []).filter((file) =>
      ACCEPTED_TYPES.includes(file.type)
    );
    if (files.length) onChangeStaged([...staged, ...files]);
  };

  const removeExisting = (index) => {
    onChangeExisting(existing.filter((_, i) => i !== index));
  };

  const removeStaged = (index) => {
    onChangeStaged(staged.filter((_, i) => i !== index));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    addFiles(event.dataTransfer.files);
  };

  /* Reordering applies to already-uploaded images; staged files are appended
     after them in the order they were picked. */
  const onCardDragStart = (index) => setDragIndex(index);

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
    <div className="field-group">
      <label>
        {label} ({total})
      </label>

      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && fileRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileRef.current?.click();
          }
        }}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
        />

        {uploading ? (
          <>
            <Spinner size={24} />
            <p>
              Duke ngarkuar{progress ? ` ${progress.done}/${progress.total}` : ''}...
              {progress?.name && <><br /><small>{progress.name}</small></>}
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
              <span>Kliko për të ngarkuar</span> ose tërhiq fotot këtu
              <br />
              <small>{hint}</small>
            </p>
          </>
        )}
      </div>

      {total > 0 && (
        <>
          <p className="upload-help">
            Tërhiq fotot për t’i renditur. Fotoja e parë përdoret si kopertinë.
          </p>

          <div className="upload-previews">
            {existing.map((image, index) => (
              <div
                key={image.url}
                className={`upload-preview-item ${index === 0 ? 'is-cover' : ''}`}
                draggable
                onDragStart={() => onCardDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onCardDrop(index)}
              >
                <img src={image.thumbUrl || image.url} alt="" />
                {index === 0 && <span className="cover-badge">Kopertina</span>}
                <div className="preview-actions">
                  {index !== 0 && (
                    <button type="button" onClick={() => makeCover(index)} title="Bëje kopertinë">
                      ★
                    </button>
                  )}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeExisting(index)}
                    title="Hiq"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {staged.map((file, index) => (
              <div key={`${file.name}-${index}`} className="upload-preview-item is-pending">
                {previews[index] && <img src={previews[index]} alt="" />}
                <span className="pending-badge">
                  {formatBytes(file.size)} → e re
                </span>
                <div className="preview-actions">
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeStaged(index)}
                    title="Hiq"
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
};

export default ImageUploader;
