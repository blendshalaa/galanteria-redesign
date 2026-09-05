import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { dataProducts } from '../../data/products';
import { Spinner } from '../../Components/ui';
import { slugify } from '../../utils/slugify';
import { processImage } from '../../utils/imageProcessing';
import './AdminDashboard.scss';

/**
 * One-time import of the legacy src/data/products.js dataset into Supabase.
 *
 * THIS TOOL WAS DANGEROUS. It was a plain button whose only safeguard was a
 * sentence of prose ("click this only once, or you will create duplicates").
 * A second click — a double-click, a refresh, a curious colleague — re-inserted
 * all 58 records and re-uploaded every image again, with no undo.
 *
 * It now:
 *   - refuses to run when the target tables already contain rows, unless the
 *     operator explicitly overrides;
 *   - offers a dry run that reports exactly what it would do and writes nothing;
 *   - requires a typed confirmation before a real run;
 *   - skips records whose slug already exists, so a re-run repairs rather than
 *     duplicates;
 *   - carries over `name2` (the per-photo product codes) into the new
 *     `image_captions` column. The original migration dropped it, which is why
 *     the gallery captions the product page renders have always been empty;
 *   - maps categories onto the new `category_slug`;
 *   - compresses images on the way in, like every other uploader now does.
 *
 * Once the catalogue is confirmed in Supabase, this file, src/data/products.js
 * and src/data/projects.js can all be deleted — see the README.
 */

const CONFIRM_PHRASE = 'MIGRO';

/* Mirrors the mapping in supabase/migrations/003_categories.sql. */
const CATEGORY_SLUGS = {
  'karrigë zyreje': 'office-chairs',
  'karrige zyreje': 'office-chairs',
  'karrigë takimesh': 'meeting-chairs',
  'karrige takimesh': 'meeting-chairs',
  'karrigë pritjeje': 'waiting-chairs',
  'karrige pritjeje': 'waiting-chairs',
  'tavolinë pune': 'working-tables',
  'tavolina pune': 'working-tables',
  'tavolina takimi': 'meeting-tables',
  'tavolina takimesh': 'meeting-tables',
  workstation: 'workstations',
  'ambiente pune': 'workstations',
  dollapë: 'cabinets',
  kabinete: 'cabinets',
  sirtar: 'drawers',
  sirtarët: 'drawers',
  banjë: 'bathrooms',
  tjera: 'others',
  'të tjera': 'others',
};

const AdminMigrate = () => {
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [counts, setCounts] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [override, setOverride] = useState(false);

  const addLog = (message) => setLog((prev) => [...prev, message]);

  /* Precondition check: how much is already in the database? */
  useEffect(() => {
    (async () => {
      const [products, projects] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({ products: products.count ?? 0, projects: projects.count ?? 0 });
    })();
  }, []);

  const uploadImage = async (assetUrl, folder) => {
    if (!assetUrl) return null;
    try {
      const response = await fetch(assetUrl);
      const blob = await response.blob();
      const file = new File([blob], assetUrl.split('/').pop() || 'image.jpg', {
        type: blob.type || 'image/jpeg',
      });

      const processed = await processImage(file);
      const base = `${Date.now()}-${Math.random().toString(36).slice(2)}.${processed.ext}`;

      const full = await supabase.storage
        .from('galanteria-images')
        .upload(`${folder}/${base}`, processed.full, { contentType: processed.full.type });
      if (full.error) throw full.error;

      const thumb = await supabase.storage
        .from('galanteria-images')
        .upload(`${folder}/thumbs/${base}`, processed.thumb, { contentType: processed.thumb.type });
      if (thumb.error) throw thumb.error;

      return {
        url: supabase.storage.from('galanteria-images').getPublicUrl(`${folder}/${base}`).data.publicUrl,
        thumbUrl: supabase.storage.from('galanteria-images').getPublicUrl(`${folder}/thumbs/${base}`).data.publicUrl,
      };
    } catch (error) {
      console.error('[Galanteria] Migration image upload failed', assetUrl, error);
      return null;
    }
  };

  const run = async ({ dryRun }) => {
    setRunning(true);
    setLog([dryRun ? '— PROVË (nuk shkruhet asgjë) —' : 'Duke filluar migrimin...']);

    const items = Object.entries(dataProducts.sq);

    // Fetch the slugs already present so a re-run tops up rather than duplicates.
    const [{ data: existingProducts }, { data: existingProjects }] = await Promise.all([
      supabase.from('products').select('slug'),
      supabase.from('projects').select('slug'),
    ]);
    const takenProducts = new Set((existingProducts || []).map((row) => row.slug));
    const takenProjects = new Set((existingProjects || []).map((row) => row.slug));

    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (const [key, item] of items) {
      const isProject = !item.category;
      const slug = slugify(key);
      const taken = isProject ? takenProjects : takenProducts;

      if (taken.has(slug)) {
        addLog(`⏭️  Ekziston, u anashkalua: ${item.name} (/${slug})`);
        skipped += 1;
        continue;
      }

      if (dryRun) {
        const photoCount = (item.photos || []).length + (item.firstphoto ? 1 : 0);
        addLog(
          `➕ Do të krijohej ${isProject ? 'projekt' : 'produkt'}: ${item.name} ` +
          `(/${slug}, ${photoCount} foto)`
        );
        created += 1;
        continue;
      }

      try {
        addLog(`Po përpunoj: ${item.name}`);

        const folder = isProject ? 'projects' : 'products';
        let photos = item.photos || [];
        if (item.firstphoto && !photos.includes(item.firstphoto)) {
          photos = [item.firstphoto, ...photos];
        }

        const uploaded = [];
        for (const photo of photos) {
          const result = await uploadImage(photo, folder);
          if (result) uploaded.push(result);
        }

        const base = {
          slug,
          images: uploaded.map((image) => image.url),
          thumbnails: uploaded.map((image) => image.thumbUrl),
          created_at: new Date().toISOString(),
        };

        const { error } = isProject
          ? await supabase.from('projects').insert([{ ...base, title: item.name }])
          : await supabase.from('products').insert([{
              ...base,
              name: item.name,
              category: item.category,
              category_slug: CATEGORY_SLUGS[item.category?.toLowerCase().trim()] || 'others',
              description_sq: item.description || '',
              description: dataProducts.en?.[key]?.description || '',
              description_de: dataProducts.de?.[key]?.description || '',
              // Previously dropped entirely, which is why gallery captions
              // have always been blank on the product page.
              image_captions: item.name2 || null,
            }]);

        if (error) throw error;

        taken.add(slug);
        created += 1;
        addLog(`✅ U ruajt: ${item.name}`);
      } catch (error) {
        failed += 1;
        addLog(`❌ Gabim me ${item.name}: ${error.message}`);
      }
    }

    addLog(
      dryRun
        ? `— Fundi i provës: ${created} do të krijoheshin, ${skipped} ekzistojnë —`
        : `🎉 Përfundoi: ${created} u krijuan, ${skipped} u anashkaluan, ${failed} dështuan.`
    );
    setRunning(false);
    setConfirmText('');
  };

  const hasData = counts && (counts.products > 0 || counts.projects > 0);
  const blocked = hasData && !override;
  const canRun = !running && !blocked && confirmText.trim().toUpperCase() === CONFIRM_PHRASE;

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title">
          <h2>Migrimi i të Dhënave</h2>
          <p>Import një-herësh nga kodi i vjetër në databazë</p>
        </div>
      </div>

      <div className="admin-card settings-card-body">
        {counts === null ? (
          <div className="admin-loading"><Spinner />Duke kontrolluar databazën...</div>
        ) : (
          <>
            <div className={`migrate-status ${hasData ? 'warn' : 'ok'}`}>
              <strong>Gjendja aktuale:</strong> {counts.products} produkte, {counts.projects} projekte
              në databazë.
              {hasData ? (
                <p>
                  Databaza nuk është bosh — migrimi ka gjasa të jetë bërë tashmë. Produktet me
                  slug ekzistues anashkalohen automatikisht, por vazhdoni vetëm nëse e dini
                  çfarë po bëni.
                </p>
              ) : (
                <p>Databaza është bosh. Migrimi mund të vazhdojë i sigurt.</p>
              )}
            </div>

            {hasData && (
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={override}
                  onChange={(event) => setOverride(event.target.checked)}
                />
                <span>E kuptoj rrezikun dhe dua të vazhdoj gjithsesi.</span>
              </label>
            )}

            <div className="migrate-actions">
              <button
                className="admin-btn secondary"
                onClick={() => run({ dryRun: true })}
                disabled={running}
              >
                {running ? <Spinner size={14} /> : null}
                Provë (pa ndryshime)
              </button>
            </div>

            <div className="field-group">
              <label htmlFor="migrate-confirm">
                Për të vazhduar me migrimin real, shkruani <code>{CONFIRM_PHRASE}</code>
              </label>
              <input
                id="migrate-confirm"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                placeholder={CONFIRM_PHRASE}
                disabled={blocked || running}
              />
            </div>

            <div className="migrate-actions">
              <button
                className="admin-btn primary"
                onClick={() => run({ dryRun: false })}
                disabled={!canRun}
              >
                {running ? <Spinner size={14} /> : null}
                {running ? 'Duke migruar...' : 'Fillo Migrimin'}
              </button>
            </div>
          </>
        )}

        <div className="migrate-log">
          {log.length === 0
            ? 'Log i procesit...'
            : log.map((line, index) => <div key={index}>{line}</div>)}
        </div>
      </div>
    </div>
  );
};

export default AdminMigrate;
