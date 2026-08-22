import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content/projects");

export interface ProjectFrontmatter {
  id: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  heroImage: string;
  links: { label: string; url: string; type: string }[];
  techStack: { category: string; items: string[] }[];
}

export interface ProjectData {
  frontmatter: ProjectFrontmatter;
  content: string;
}

export function getProjects(): ProjectFrontmatter[] {
  if (!fs.existsSync(contentDir)) return [];
  
  const files = fs.readdirSync(contentDir).filter((file) => file.endsWith(".mdx"));
  
  return files.map((file) => {
    const rawContent = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data } = matter(rawContent);
    return {
      id: file.replace(/\.mdx$/, ""),
      ...data,
    } as ProjectFrontmatter;
  });
}

export function getProject(id: string): ProjectData | null {
  const filePath = path.join(contentDir, `${id}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  return {
    frontmatter: {
      id,
      ...data,
    } as ProjectFrontmatter,
    content,
  };
}
