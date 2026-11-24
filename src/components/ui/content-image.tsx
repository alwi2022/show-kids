"use client";
import { useState } from "react";
import type { ImgHTMLAttributes } from "react";
import { Icon } from "./icon";
export function ContentImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSource, setFailedSource] = useState<string>();
  if (!props.src || failedSource === props.src)
    return (
      <span
        className={`image-fallback ${props.className || ""}`}
        role="img"
        aria-label={props.alt || "Gambar konten"}
      >
        <Icon name="file" />
        <span>SHOW Kids</span>
      </span>
    );
  return <img {...props} onError={() => setFailedSource(String(props.src))} />;
}
