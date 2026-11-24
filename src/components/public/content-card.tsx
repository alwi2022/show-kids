import { ContentImage } from "@/components/ui/content-image";
import Link from "next/link";
import type { Content } from "@/lib/content";
import { formatDuration } from "@/lib/content";
import { Icon } from "@/components/ui/icon";
import { CardMotion } from "@/components/ui/motion";
import { NavigationPending } from "@/components/ui/navigation-pending";
export function ContentCard({ content }: { content: Content }) {
  return (
    <CardMotion>
      <article className="content-card">
        <Link href={`/content/${content.slug}`}>
          <div className="card-image">
            <ContentImage
              src={content.thumbnail}
              alt={content.alt_text}
              width="640"
              height="400"
              loading="lazy"
            />
            {content.is_new && <span className="new-badge">New</span>}
            <span className="media-label">
              <Icon
                name={
                  content.type === "Video"
                    ? "play"
                    : content.type === "Worksheet"
                      ? "file"
                      : "book"
                }
              />
              {content.type === "Video" && content.duration
                ? formatDuration(content.duration)
                : content.type}
            </span>
          </div>
          <div className="card-copy">
            <p className="category-label">{content.category}</p>
            <h3>{content.title}</h3>
            <NavigationPending />
          </div>
        </Link>
      </article>
    </CardMotion>
  );
}
