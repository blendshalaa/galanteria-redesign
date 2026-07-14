import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { dataProducts } from '../../data/products';
import './AdminDashboard.scss';

const AdminMigrate = () => {
  const [log, setLog] = useState([]);
  const [isMigrating, setIsMigrating] = useState(false);

  const addLog = (message) => {
    setLog((prev) => [...prev, message]);
  };

  const uploadImage = async (imageUrl, folder) => {
    try {
      if (!imageUrl) return null;
      // Fetch the image as a Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const ext = imageUrl.split('.').pop().split('?')[0] || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from('galanteria-images')
        .upload(`${folder}/${fileName}`, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('galanteria-images')
        .getPublicUrl(`${folder}/${fileName}`);
        
      return urlData.publicUrl;
    } catch (err) {
      console.error('Fetch/upload error:', err);
      return null;
    }
  };

  const startMigration = async () => {
    setIsMigrating(true);
    setLog(['Duke filluar migrimin... Kjo mund të marrë disa minuta.']);

    const items = Object.entries(dataProducts.sq);
    
    for (const [key, item] of items) {
      try {
        const isProject = !item.category;
        addLog(`Po përpunoj ${isProject ? 'projektin' : 'produktin'}: ${item.name}`);

        const uploadedImages = [];
        const folder = isProject ? 'projects' : 'products';

        // Add firstphoto to array if it's not in photos
        let photosToUpload = item.photos || [];
        if (item.firstphoto && !photosToUpload.includes(item.firstphoto)) {
          photosToUpload = [item.firstphoto, ...photosToUpload];
        }

        // Upload images
        for (const photoUrl of photosToUpload) {
          const publicUrl = await uploadImage(photoUrl, folder);
          if (publicUrl) {
            uploadedImages.push(publicUrl);
          }
        }

        if (isProject) {
          // Insert into projects
          const { error } = await supabase.from('projects').insert([{
            title: item.name,
            slug: key,
            images: uploadedImages,
            created_at: new Date().toISOString(),
          }]);
          if (error) throw error;
        } else {
          // Get translations
          const descEn = dataProducts.en?.[key]?.description || '';
          const descDe = dataProducts.de?.[key]?.description || '';
          
          // Insert into products
          const { error } = await supabase.from('products').insert([{
            name: item.name,
            slug: key,
            category: item.category,
            description_sq: item.description || '',
            description: descEn,
            description_de: descDe,
            images: uploadedImages,
            created_at: new Date().toISOString(),
          }]);
          if (error) throw error;
        }

        addLog(`✅ U ruajt me sukses: ${item.name}`);
      } catch (err) {
        addLog(`❌ Gabim me ${item.name}: ${err.message}`);
      }
    }

    addLog('🎉 Migrimi përfundoi!');
    setIsMigrating(false);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title">
          <h2>Migrimi i të Dhënave</h2>
          <p>Kopjo të gjitha produktet dhe projektet nga kodi në databazë (Supabase)</p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 24 }}>
        <p style={{ marginBottom: 24, color: 'rgba(240,237,232,0.7)', lineHeight: 1.6 }}>
          Ky mjet do të lexojë file-in tuaj lokal <code>products.js</code>, do të ngarkojë të gjitha fotot automatikisht në Supabase Storage, dhe do të ruajë produktet dhe projektet në databazën tuaj të re.
          <br /><br />
          <strong>Kujdes:</strong> Kliko këtë buton vetëm një herë. Nëse e klikon përsëri, do të krijohen produkte të dyfishta!
        </p>

        <button 
          className="admin-btn primary" 
          onClick={startMigration} 
          disabled={isMigrating}
        >
          {isMigrating ? <span className="spinner" /> : null}
          {isMigrating ? 'Duke migruar...' : 'Fillo Migrimin'}
        </button>

        <div style={{ 
          marginTop: 24, 
          background: 'rgba(0,0,0,0.5)', 
          padding: 16, 
          borderRadius: 8,
          height: 300,
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.8)'
        }}>
          {log.length === 0 ? 'Log i procesit...' : log.map((l, i) => (
            <div key={i} style={{ marginBottom: 4 }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMigrate;
