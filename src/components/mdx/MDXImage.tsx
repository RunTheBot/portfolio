import React from "react";
import Image from "next/image";

interface MDXImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Drop-in replacement for MDX `img` tags and a standalone `<MDXImage>` component.
 * The `alt` text is rendered as a caption below the image.
 * Does not include outer margin — the caller (img handler, ImageGrid, Carousel) owns spacing.
 */
export default function MDXImage({
  src,
  alt,
  width = 1200,
  height = 800,
}: MDXImageProps) {
  if (!src) return null;

  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  return (
    <figure className="my-6 not-prose border border-white/[0.15] bg-white/[0.02] overflow-hidden">
      {isExternal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || ""}
          className="w-full h-auto block object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt || ""}
          width={width}
          height={height}
          className="w-full h-auto block object-cover"
        />
      )}
      {alt && (
        <figcaption className="px-3 py-2 text-[11px] text-white/40 font-mono text-center border-t border-white/[0.06]">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
