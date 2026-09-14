import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogs } from "@/lib/mdx";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on robotics, software, and building things.",
};

export default function BlogIndex() {
  const posts = getBlogs();
  return (
    <>
      <main className="max-w-[900px] mx-auto px-6 md:px-10 pt-24 pb-20 min-h-screen">
        <Link href="/#blog" className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/80 transition-colors mb-16">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
        <div className="mb-12">
          <p className="text-[12px] text-white/30 font-mono mb-2">NOTES &amp; ESSAYS</p>
          <h1 className="font-serif text-4xl text-[#f1eee7] mb-3">Writing</h1>
          <p className="text-[15px] text-white/45 leading-[1.8] max-w-xl">Thoughts from the workbench — robotics, software, and the process of making things.</p>
        </div>
        <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group flex items-center justify-between gap-6 py-6">
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <h2 className="font-serif text-xl text-[#f1eee7] group-hover:text-white transition-colors">{post.title}</h2>
                  <time className="text-[12px] text-white/30 font-mono" dateTime={post.date}>{post.date}</time>
                </div>
                <p className="text-[14px] text-white/40 leading-relaxed max-w-2xl">{post.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0 text-white/20 group-hover:text-white/70 transition-colors" />
            </Link>
          ))}
        </div>
      </main>
      <ThemeSwitcher />
    </>
  );
}
