import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/mdx";
import ProjectPage from "./ProjectPage";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);

  if (!project) return { title: "Not Found" };

  const title = project.frontmatter.title;
  const description = project.frontmatter.tagline;
  const url = `https://aaronhuang.dev/projects/${id}`;
  const heroImage = project.frontmatter.heroImage;

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${id}`,
    },
    openGraph: {
      title: `${title} | Aaron Huang`,
      description,
      url,
      type: "article",
      images: heroImage
        ? [
            {
              url: heroImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Aaron Huang`,
      description,
      creator: "@RunTheBot",
      images: heroImage ? [heroImage] : undefined,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.frontmatter.title,
    description: project.frontmatter.tagline,
    image: project.frontmatter.heroImage
      ? `https://aaronhuang.dev${project.frontmatter.heroImage}`
      : undefined,
    author: {
      "@type": "Person",
      name: "Aaron Huang",
      url: "https://aaronhuang.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Aaron Huang",
    },
    url: `https://aaronhuang.dev/projects/${id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectPage project={project} />
      <ThemeSwitcher />
    </>
  );
}
