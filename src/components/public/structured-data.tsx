"use client";
import { useEffect } from "react";
export function StructuredData({ json }: { json: string }) {
  useEffect(() => {
    const existing = document.getElementById("content-schema");
    const script = existing || document.createElement("script");
    script.id = "content-schema";
    script.setAttribute("type", "application/ld+json");
    script.textContent = json;
    if (!existing) document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [json]);
  return null;
}
