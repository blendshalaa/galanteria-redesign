import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Project1 from '../../Pages/Project1/Project1';
import { supabase } from '../../lib/supabase';
import useLang from '../../Hooks/useLang';
import { ErrorState, LoadingState } from '../../Components/ui';

const Project1Page = () => {
  const { slug } = useParams();
  const { t } = useLang();

  const [project, setProject] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | error

  const load = useCallback(async () => {
    setStatus('loading');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[Galanteria] Failed to load project', slug, error);
      setStatus('error');
      return;
    }

    if (!data) {
      setStatus('missing');
      return;
    }

    setProject(data);
    setStatus('ready');
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'loading') return <LoadingState label={t('loading')} />;

  if (status === 'error') {
    return (
      <div className="product-page-state">
        <ErrorState
          title={t('errorTitle')}
          description={t('errorBody')}
          onRetry={load}
          retryLabel={t('retry')}
        />
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <div className="product-page-state">
        <ErrorState title={t('projectNotFound')} description={t('notFoundBody')} />
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 80 }}>
          <Link to="/Projects" className="ui-retry-btn">{t('back')}</Link>
        </div>
      </div>
    );
  }

  return (
    <Project1
      data={{
        name: project.title,
        slug: project.slug,
        description: project.description,
        location: project.location,
        year: project.year,
        photos: project.images || [],
        thumbnails: project.thumbnails || project.images || [],
        firstphoto: project.images?.[0],
      }}
    />
  );
};

export default Project1Page;
