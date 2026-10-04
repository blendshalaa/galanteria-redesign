import { notFound } from 'next/navigation';
import { getProject } from '@/lib/queries';
import ProjectDetail from '@/components/project/ProjectDetail';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return { title: 'Project not found', robots: { index: false } };

  const description =
    project.description?.slice(0, 300) || `${project.title} — a completed project by Galanteria Group.`;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/project/${slug}` },
    openGraph: {
      type: 'article',
      title: `${project.title} | Galanteria Group`,
      description,
      url: `/project/${slug}`,
      images: project.images?.[0] ? [project.images[0]] : undefined,
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;

  const project = await getProject(slug);
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
