import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { getBlogs } from "@/lib/mdx";

export default function BlogSection() {
  const posts = getBlogs();

  return (
    <section id="blog" className="space-y-8 scroll-mt-20">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-2xl text-[#f1eee7]">Writing</h2>
        <Link href="/blog" className="text-[12px] text-white/30 hover:text-white/70 transition-colors">
          All posts <ArrowRight className="inline w-3 h-3 ml-1" />
        </Link>
      </div>

      <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {posts.length === 0 ? (
          <p className="py-6 text-[14px] text-white/40">New notes are on the way.</p>
        ) : posts.slice(0, 3).map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="group block py-5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h3 className="font-serif text-lg text-[#f1eee7] group-hover:text-white transition-colors">
                {post.title}
              </h3>
              <time className="text-[12px] text-white/30 font-mono shrink-0" dateTime={post.date}>
                {post.date}
              </time>
            </div>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-white/40">
              {post.description}
            </p>
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag) => <span key={tag} className="text-[11px] text-white/25 font-mono">#{tag}</span>)}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
