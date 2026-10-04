import { getProjects } from '@/lib/queries';
import ProjectsGrid from '@/components/projects/ProjectsGrid';

export const metadata = {
  title: 'Our Projects',
  description:
    'Explore our portfolio of completed projects. See how Galanteria Group furnishes offices, schools and hotels across Kosovo and the region.',
  alternates: { canonical: '/Projects' },
  openGraph: {
    title: 'Projects | Galanteria Group',
    description: 'Offices, schools and hotels we have furnished.',
    url: '/Projects',
  },
};

export default async function ProjectsPage() {
  const { projects, failed } = await getProjects();

  return <ProjectsGrid projects={projects} failed={failed} />;
}
