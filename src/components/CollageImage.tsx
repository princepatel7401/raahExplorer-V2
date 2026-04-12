import { useCallback, useMemo, useState } from "react";
import { buildCollageImageSrcChain } from "../lib/resolveImageUrl";

type Props = {
  src: string;
  alt: string;
  loading?: "eager" | "lazy";
  className?: string;
};

/**
 * Tries fallback URLs when the first fails (needed for Google Drive embeds).
 */
export function CollageImage({ src, alt, loading = "lazy", className }: Props) {
  const chain = useMemo(() => buildCollageImageSrcChain(src), [src]);
  const [index, setIndex] = useState(0);

  const activeSrc = chain[index] ?? chain[0] ?? src;

  const onError = useCallback(() => {
    setIndex((i) => (i + 1 < chain.length ? i + 1 : i));
  }, [chain.length]);

  return (
    <img
      className={className}
      src={activeSrc}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={index < chain.length - 1 ? onError : undefined}
    />
  );
}
