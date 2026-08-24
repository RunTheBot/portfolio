import React from "react";

interface ImageGridProps {
  children: React.ReactNode;
  /** Number of columns at ≥ sm breakpoint. Defaults to 2. */
  cols?: 2 | 3;
}

/**
 * A responsive image grid for MDX content.
 * Usage in MDX:
 *   <ImageGrid cols={3}>
 *     <MDXImage src="..." alt="Caption A" />
 *     <MDXImage src="..." alt="Caption B" />
 *     <MDXImage src="..." alt="Caption C" />
 *   </ImageGrid>
 */
export default function ImageGrid({ children, cols = 2 }: ImageGridProps) {
  const colClass = cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className={`my-6 not-prose grid grid-cols-1 ${colClass} gap-4`}>
      {children}
    </div>
  );
}
