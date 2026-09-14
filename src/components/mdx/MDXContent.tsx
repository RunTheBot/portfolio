import React from "react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import MDXImage from "@/components/mdx/MDXImage";
import Carousel from "@/components/mdx/Carousel";
import ImageGrid from "@/components/mdx/ImageGrid";

const mdxComponents = {
  img: (props: React.ComponentPropsWithoutRef<"img">) => {
    const { src, alt, width, height } = props;
    if (!src || typeof src !== "string") return null;
    return <MDXImage src={src} alt={alt} width={typeof width === "number" ? width : 1200} height={typeof height === "number" ? height : 800} />;
  },
  MDXImage,
  Carousel,
  ImageGrid,
  Image: (props: React.ComponentProps<typeof Image>) => <Image {...props} />,
};

export default function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose prose-invert prose-white max-w-none prose-headings:font-serif prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-a:text-[#3b82f6] prose-a:no-underline hover:prose-a:underline">
      <MDXRemote source={source} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] } }} />
    </div>
  );
}
