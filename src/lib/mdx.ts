import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentBaseDir = path.join(process.cwd(), "src/content");
const projectsDir = path.join(contentBaseDir, "projects");
const experienceDir = path.join(contentBaseDir, "experience");

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

export interface ProfileData {
  name: string;
  alias: string;
  title: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  resumeUrl: string;
}

export interface ExperienceData {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  order: number;
  tags?: string[];
  links?: { label: string; url: string }[];
  content: string;
  responsibilities: string[];
}

export interface EducationData {
  institution: string;
  degree: string;
  specialization: string;
  location: string;
  period: string;
  status: string;
  description: string;
}

export interface AwardItem {
  title: string;
  org: string;
  year: string;
  desc?: string;
}

export function getProjects(): ProjectFrontmatter[] {
  if (!fs.existsSync(projectsDir)) return [];
  
  const files = fs.readdirSync(projectsDir).filter((file) => file.endsWith(".mdx"));
  
  return files.map((file) => {
    const rawContent = fs.readFileSync(path.join(projectsDir, file), "utf-8");
    const { data } = matter(rawContent);
    return {
      id: file.replace(/\.mdx$/, ""),
      ...data,
    } as ProjectFrontmatter;
  });
}

export function getProject(id: string): ProjectData | null {
  const filePath = path.join(projectsDir, `${id}.mdx`);
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

export function getProfile(): ProfileData {
  const filePath = path.join(contentBaseDir, "profile.mdx");
  if (!fs.existsSync(filePath)) {
    return {
      name: "Aaron Huang",
      alias: "RunTheBot",
      title: "Robotics & Software Engineer",
      email: "contact@aaronhuang.dev",
      github: "https://github.com/runthebot",
      linkedin: "https://linkedin.com/in/haaron",
      twitter: "https://twitter.com/RunTheBot",
      resumeUrl: "/resume.pdf",
    };
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(rawContent);
  return data as ProfileData;
}

export function getExperiences(): ExperienceData[] {
  if (!fs.existsSync(experienceDir)) return [];

  const files = fs.readdirSync(experienceDir).filter((file) => file.endsWith(".mdx"));

  const list = files.map((file) => {
    const rawContent = fs.readFileSync(path.join(experienceDir, file), "utf-8");
    const { data, content } = matter(rawContent);
    
    // Parse bullet points from content
    const responsibilities = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace(/^- \s*/, ""));

    return {
      id: file.replace(/\.mdx$/, ""),
      role: data.role || "",
      organization: data.organization || "",
      location: data.location || "",
      period: data.period || "",
      order: data.order ?? 99,
      tags: data.tags || [],
      links: data.links || [],
      content,
      responsibilities,
    };
  });

  return list.sort((a, b) => a.order - b.order);
}

export function getEducation(): EducationData {
  const filePath = path.join(contentBaseDir, "education.mdx");
  if (!fs.existsSync(filePath)) {
    return {
      institution: "University of Toronto — St. George Campus",
      degree: "BASc. in Engineering Science",
      specialization: "Robotics Engineering Specialization",
      location: "Toronto, ON",
      period: "Sep 2026 — June 2031",
      status: "Incoming Student",
      description: "Engineering Science (EngSci) at University of Toronto.",
    };
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);
  return {
    ...(data as EducationData),
    description: content.trim() || data.description || "",
  };
}

export function getAwards(): AwardItem[] {
  const filePath = path.join(contentBaseDir, "awards.mdx");
  if (!fs.existsSync(filePath)) return [];

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(rawContent);
  return (data.awards || []) as AwardItem[];
}
