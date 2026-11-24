import { ContentImage } from "@/components/ui/content-image";
import Link from "next/link";
import { publicCatalogue } from "@/server/services/content-service";
import { parseFilters, catalogUrl, videoEmbed } from "@/lib/content";
import { SingAlongPlayer } from "./singalong-player";
import { Icon } from "@/components/ui/icon";

const topics = [
  {
    category: "Animal & Nature",
    title: "Temui penghuni alam",
    description:
      "Dari kupu-kupu sampai lebah. Kenali kehidupan kecil di sekitar kita.",
    icon: "leaf" as const,
  },
  {
    category: "Education Learning",
    title: "Dunia punya banyak cerita",
    description:
      "Lihat lebih dekat Bumi, Matahari, dan hal-hal yang membuat penasaran.",
    icon: "sun" as const,
  },
  {
    category: "Healthy Habits",
    title: "Kenali tubuhmu",
    description: "Mulai percakapan tentang vitamin dan kebiasaan sehari-hari.",
    icon: "book" as const,
  },
];

export async function ExploreStories() {
  const { contents } = await publicCatalogue(parseFilters({})).catch(() => ({
    contents: [],
    count: 0,
  }));
  const available = topics.flatMap((topic) => {
    const content = contents.find((c) => c.category === topic.category);
    return content ? [{ ...topic, content }] : [];
  });
  if (!available.length) return null;
  return (
    <section
      className="container discovery-section"
      aria-labelledby="discovery-heading"
    >
      <div className="discovery-heading">
        <h2 id="discovery-heading">Hari ini, mau tahu apa?</h2>
        <p>Pilih dunia yang ingin dijelajahi si kecil.</p>
      </div>
      <div className="discovery-topics">
        {available.map((topic) => (
          <Link
            key={topic.category}
            href={catalogUrl({ category: topic.category })}
            className="discovery-topic"
          >
            <div className="topic-art">
              <ContentImage
                src={topic.content.thumbnail}
                alt={topic.content.alt_text}
                width="640"
                height="400"
                loading="lazy"
              />
            </div>
            <div className="topic-copy">
              <span className="topic-icon">
                <Icon name={topic.icon} />
              </span>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <span className="topic-action">Jelajahi {topic.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function SingAlong() {
  const { contents } = await publicCatalogue(
    parseFilters({ type: "Video", category: "Music & Song" }),
  ).catch(() => ({ contents: [], count: 0 }));
  const song =
    contents.find((c) => c.slug === "head-shoulders-knees-and-toes") ||
    contents[0];
  if (!song) return null;
  const embed = videoEmbed(song.media_url);
  if (!embed) return null;
  return (
    <SingAlongPlayer
      title={song.title}
      thumbnail={song.thumbnail}
      altText={song.alt_text}
      duration={song.duration}
      embed={embed}
    />
  );
}
