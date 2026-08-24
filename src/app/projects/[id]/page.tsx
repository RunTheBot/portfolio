import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/mdx";
import ProjectPage from "./ProjectPage";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  
  if (!project) return { title: "Not Found" };
  
  return {
    title: `${project.frontmatter.title} | Aaron Huang`,
    description: project.frontmatter.tagline,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectPage project={project} />
      <ThemeSwitcher />
    </>
  );
}
