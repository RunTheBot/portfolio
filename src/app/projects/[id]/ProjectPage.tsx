import React from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowLeft, ExternalLink, Github, Play } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ProjectData } from "@/lib/mdx";

const mdxComponents = {
  img: (props: React.ComponentPropsWithoutRef<"img">) => {
    const { src, alt, className, width, height, ...rest } = props;
    if (!src || typeof src !== "string") return null;
    return (
      <Image
        src={src}
        alt={alt || ""}
        width={typeof width === "number" ? width : 1200}
        height={typeof height === "number" ? height : 800}
        className={className || "w-full h-auto block object-cover"}
        {...rest}
      />
    );
  },
  Image: (props: React.ComponentProps<typeof Image>) => <Image {...props} />,
};

export default function ProjectPage({ project }: { project: ProjectData }) {
  const { frontmatter, content } = project;

  const linkIcon = (type: string) => {
    if (type === "github") return <Github className="w-3.5 h-3.5" />;
    if (type === "video") return <Play className="w-3.5 h-3.5" />;
    return <ExternalLink className="w-3.5 h-3.5" />;
  };

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/[0.15]">
        <div className="max-w-[900px] mx-auto px-6 md:px-10">
          <div className="flex items-center h-14">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[900px] mx-auto px-6 md:px-10 pt-24 pb-20">
        {/* Hero image */}
        {frontmatter.heroImage && (
          <div 
            className="rounded-none overflow-hidden mb-10 w-full bg-white/[0.02] border border-white/[0.15]"
            style={{ viewTransitionName: `project-image-${frontmatter.id}` }}
          >
            <Image
              src={frontmatter.heroImage}
              alt={frontmatter.title}
              width={1200}
              height={675}
              priority
              className="w-full h-auto block object-contain"
            />
          </div>
        )}

        {/* Title block */}
        <div className="mb-10">
          <p className="text-[12px] text-white/30 font-mono mb-2">
            {frontmatter.year} · {frontmatter.role}
          </p>
          <h1 
            className="font-serif text-3xl md:text-4xl text-[#f1eee7] mb-3"
            style={{ viewTransitionName: `project-title-${frontmatter.id}` }}
          >
            {frontmatter.title}
          </h1>
          <p className="text-[16px] text-white/50 leading-[1.8] max-w-2xl">
            {frontmatter.tagline}
          </p>
        </div>

        {/* Links */}
        {frontmatter.links && (
          <div className="flex flex-wrap gap-2 mb-12">
            {frontmatter.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-white/50 hover:text-white/90 bg-white/[0.02] hover:bg-white/[0.07] border border-white/[0.15] hover:border-white/[0.3] rounded-none transition-colors"
              >
                {linkIcon(link.type)}
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Content (Rendered via MDX) */}
        <div className="prose prose-invert prose-white max-w-none prose-headings:font-serif prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-a:text-[#3b82f6] prose-a:no-underline hover:prose-a:underline">
          <MDXRemote source={content} components={mdxComponents} />
        </div>

        {/* Tech */}
        {frontmatter.techStack && (
          <div className="mt-12 pt-4 border-t border-white/[0.15] space-y-3">
            <h2 className="font-serif text-xl text-[#f1eee7]">
              Stack
            </h2>
            {frontmatter.techStack.map((group, i) => (
              <div key={i} className="space-y-2">
                <p className="text-[12px] text-white/30 font-mono">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 text-[11px] text-white/40 bg-white/[0.02] border border-white/[0.15] rounded-none"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back link at bottom */}
        <div className="mt-16 pt-8 border-t border-white/[0.15]">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-[13px] text-white/30 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All projects
          </Link>
        </div>
      </main>
    </div>
  );
}
