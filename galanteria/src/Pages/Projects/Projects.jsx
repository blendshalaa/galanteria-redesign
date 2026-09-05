import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Projects.scss';
import language from '../../lang';
import useLang from '../../Hooks/useLang';
import useSEO from '../../Hooks/useSEO';
import { supabase } from '../../lib/supabase';
import { EmptyState, ErrorState, SkeletonGrid } from '../../Components/ui';

const PLACEHOLDER = 'https://placehold.co/800x600/1a1815/555?text=Galanteria';

/**
 * Project portfolio.
 *
 * Changes:
 *   - cards are `<Link>`s rather than `<div onClick>`, so they are focusable,
 *     crawlable and can be opened in a new tab;
 *   - the layout no longer singles out `projects[0]` as a large card and
 *     `projects[1]` as a tall one. Those two classes were pinned to fixed grid
 *     columns and rows, which broke above six projects and left a large hole
 *     beside the lead card at the counts below it. Every card is now the same
 *     shape in an auto-flowing grid;
 *   - loading, empty and error are three distinct states. Previously a failed
 *     request was swallowed by `if (!error && data)` and rendered as the empty
 *     message, in Albanian, to every visitor regardless of language.
 */
const Projects = () => {
  const { lang, t } = useLang();

  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');

  useSEO({
    title: 'Our Projects | Galanteria Group',
    description:
      'Explore our portfolio of completed projects. See how Galanteria Group furnishes offices, schools and hotels across Kosovo and the region.',
  });

  const load = useCallback(async () => {
    setStatus('loading');

    const { data, error } = await supabase
      .from('projects')
      .select('id, title, slug, images, thumbnails')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Galanteria] Failed to load projects', error);
      setStatus('error');
      return;
    }

    setProjects(data || []);
    setStatus('ready');
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="projects-wrapper">
      <div className="projects-header-bento">
        <div className="header-top">
          <span className="bento-eyebrow">Galanteria Group</span>
          <div className="header-line" />
        </div>
        <h1>
          {language[lang]?.projects?.[0]?.title} <em>{language[lang]?.projects?.[0]?.title2}</em>
        </h1>
      </div>

      {status === 'loading' && (
        <div className="projects-skeleton">
          <SkeletonGrid count={6} />
        </div>
      )}

      {status === 'error' && (
        <ErrorState
          title={t('errorTitle')}
          description={t('errorBody')}
          onRetry={load}
          retryLabel={t('retry')}
        />
      )}

      {status === 'ready' && projects.length === 0 && (
        <EmptyState description={t('noProjects')} />
      )}

      {status === 'ready' && projects.length > 0 && (
        <div className="projects-grid">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/project/${project.slug}`}
              className="project-card"
            >
              <img
                src={project.thumbnails?.[0] || project.images?.[0] || PLACEHOLDER}
                alt={project.title}
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
                onError={(event) => {
                  if (event.currentTarget.src !== PLACEHOLDER) {
                    event.currentTarget.src = PLACEHOLDER;
                  }
                }}
              />
              <div className="project-card-info">
                <span>{project.title}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
