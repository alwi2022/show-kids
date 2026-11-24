import Link from "next/link";
import { publicCatalogue } from "@/server/services/content-service";
import { parseFilters, catalogUrl, formatDuration } from "@/lib/content";
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
  const { contents } = await publicCatalogue(parseFilters({}));
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
              <img
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
  );
  const song =
    contents.find((c) => c.slug === "head-shoulders-knees-and-toes") ||
    contents[0];
  if (!song) return null;
  return (
    <section
      className="container singalong"
      aria-labelledby="singalong-heading"
    >
      <Link
        className="singalong-art"
        href={`/content/${song.slug}`}
        aria-label={`Tonton ${song.title}`}
      >
        <img
          src={song.thumbnail}
          alt={song.alt_text}
          width="640"
          height="400"
          loading="lazy"
        />
        <span className="singalong-play">
          <Icon name="play" width="30" height="30" />
        </span>
        {song.duration && (
          <span className="singalong-duration">
            {formatDuration(song.duration)}
          </span>
        )}
      </Link>
      <div className="singalong-copy">
        <span className="singalong-label">
          <Icon name="music" />
          Music & Song
        </span>
        <h2 id="singalong-heading">
          Ada lagu.
          <br />
          Ada waktu bersama.
        </h2>
        <p>
          Putar lagu pilihan SHOW Kids, lalu ajak si kecil ikut bernyanyi. Mulai
          dari <strong>{song.title}</strong>.
        </p>
        <Link href={`/content/${song.slug}`} className="button green">
          <Icon name="play" />
          Putar lagu
        </Link>
      </div>
    </section>
  );
}
