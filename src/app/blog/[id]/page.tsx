import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { ArrowLeft } from "lucide-react";
import { getBlog, getBlogs } from "@/lib/mdx";
import MDXContent from "@/components/mdx/MDXContent";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export function generateStaticParams() { return getBlogs().map((post) => ({ id: post.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const post = getBlog((await params).id);
  return post ? { title: post.frontmatter.title, description: post.frontmatter.description, alternates: { canonical: `/blog/${post.frontmatter.id}` } } : { title: "Not Found" };
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const post = getBlog((await params).id);
  if (!post) notFound();
  const { frontmatter, content } = post;
  return (
    <>
      <main className="max-w-[760px] mx-auto px-6 md:px-10 pt-24 pb-20 min-h-screen">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/80 transition-colors mb-16"><ArrowLeft className="w-4 h-4" /> All posts</Link>
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-white/30 font-mono mb-3"><time dateTime={frontmatter.date}>{frontmatter.date}</time><span>·</span><span>{frontmatter.readingTime}</span></div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#f1eee7] mb-4">{frontmatter.title}</h1>
          <p className="text-[16px] text-white/45 leading-[1.8]">{frontmatter.description}</p>
        </header>
        <MDXContent source={content} />
      </main>
      <ThemeSwitcher />
    </>
  );
}
