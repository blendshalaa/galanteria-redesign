import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Spinner, Toast } from '../../Components/ui';
import { uploadImages, removeByUrls } from '../../utils/storage';
import './AdminDashboard.scss';

/**
 * Homepage hero slideshow.
 *
 * This tab was write-only. It managed the `hero_images` table correctly, but
 * nothing on the public site read that table — HomePage.jsx rendered six
 * hardcoded `import` statements, so uploading here changed nothing that a
 * visitor could see. HomePage now reads `hero_images` and falls back to the
 * bundled images only when the table is empty.
 *
 * Reordering also used to issue one UPDATE per image per move; it is a single
 * upsert now.
 */
const AdminHero = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchHeroImages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[Galanteria] Failed to load hero images', error);
      showToast('Nuk u ngarkuan fotot.', 'error');
      setLoading(false);
      return;
    }

    setImages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchHeroImages(); }, [fetchHeroImages]);

  const handleUpload = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setUploading(true);
    const { uploaded, failed } = await uploadImages(files, 'hero', setProgress);
    setUploading(false);
    setProgress(null);

    if (uploaded.length) {
      const { error } = await supabase.from('hero_images').insert(
        uploaded.map((image, index) => ({
          url: image.url,
          sort_order: images.length + index + 1,
          created_at: new Date().toISOString(),
        }))
      );

      if (error) {
        // The files uploaded but the rows did not — clean up rather than
        // leaving orphans in the bucket.
        await removeByUrls(uploaded.flatMap((image) => [image.url, image.thumbUrl]));
        showToast(`Gabim: ${error.message}`, 'error');
        return;
      }
    }

    if (failed.length) {
      showToast(`${failed.length} foto nuk u ngarkuan: ${failed[0].message}`, 'error');
    } else {
      showToast('Fotot u ngarkuan me sukses!');
    }

    fetchHeroImages();
  };

  const handleDelete = async (image) => {
    if (!window.confirm('Fshini këtë foto nga slideri?')) return;

    const { error } = await supabase.from('hero_images').delete().eq('id', image.id);
    if (error) {
      showToast(error.message, 'error');
      return;
    }

    await removeByUrls([image.url]);
    setImages((prev) => prev.filter((item) => item.id !== image.id));
    showToast('Foto u fshi!');
  };

  const moveImage = async (index, direction) => {
    const next = [...images];
    const swap = index + direction;
    if (swap < 0 || swap >= next.length) return;

    [next[index], next[swap]] = [next[swap], next[index]];
    setImages(next);

    const { error } = await supabase
      .from('hero_images')
      .upsert(next.map((image, i) => ({ ...image, sort_order: i + 1 })));

    if (error) {
      showToast('Renditja nuk u ruajt.', 'error');
      fetchHeroImages();
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title">
          <p>{images.length} foto</p>
        </div>
        <button
          className="admin-btn primary"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(event) => { handleUpload(event.target.files); event.target.value = ''; }}
          />
          {uploading ? <Spinner size={14} /> : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
          {uploading
            ? `Duke ngarkuar${progress ? ` ${progress.done}/${progress.total}` : ''}...`
            : 'Ngarko Foto'}
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><Spinner />Duke ngarkuar...</div>
      ) : images.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <h3>Asnjë foto në slider</h3>
            <p>
              Derisa të ngarkoni foto këtu, ballina përdor fotot e paracaktuara.
            </p>
          </div>
        </div>
      ) : (
        <div className="hero-grid">
          {images.map((image, index) => (
            <div key={image.id} className="admin-card hero-card">
              <img src={image.url} alt="" loading="lazy" />
              <div className="hero-card-overlay">
                <span className="hero-index">#{index + 1}</span>
                <button
                  className="icon-btn"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  aria-label="Lëviz lart"
                >↑</button>
                <button
                  className="icon-btn"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                  aria-label="Lëviz poshtë"
                >↓</button>
                <button
                  className="icon-btn danger"
                  onClick={() => handleDelete(image)}
                  aria-label="Fshi foton"
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminHero;
