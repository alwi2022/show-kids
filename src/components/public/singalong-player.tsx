"use client";
import { useRef, useState } from "react";
import { ContentImage } from "@/components/ui/content-image";
import { Icon } from "@/components/ui/icon";
import { formatDuration } from "@/lib/content";

export function SingAlongPlayer({
  title,
  thumbnail,
  altText,
  duration,
  embed,
}: {
  title: string;
  thumbnail: string;
  altText: string;
  duration: number | null;
  embed: string;
}) {
  const [playing, setPlaying] = useState(false);
  const action = useRef<HTMLButtonElement>(null);
  const player = useRef<HTMLIFrameElement>(null);
  function start() {
    setPlaying(true);
  }
  function close() {
    setPlaying(false);
    action.current?.focus();
  }
  return (
    <section
      className="container singalong"
      aria-labelledby="singalong-heading"
    >
      <div className="singalong-art" id="singalong-player">
        {playing ? (
          <iframe
            ref={player}
            src={`${embed}?autoplay=1&playsinline=1`}
            title={title}
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => player.current?.focus()}
          />
        ) : (
          <button
            type="button"
            className="singalong-poster"
            onClick={start}
            aria-label={`Putar ${title} di halaman ini`}
          >
            <ContentImage
              src={thumbnail}
              alt={altText}
              width="640"
              height="400"
              loading="lazy"
            />
            <span className="singalong-play">
              <Icon name="play" width="30" height="30" />
            </span>
            {duration && (
              <span className="singalong-duration">
                {formatDuration(duration)}
              </span>
            )}
          </button>
        )}
      </div>
      <div className="singalong-copy">
        <span className="singalong-label">
          <Icon name="music" />
          Music &amp; Song
        </span>
        <h2 id="singalong-heading">
          Ada lagu.
          <br />
          Ada waktu bersama.
        </h2>
        <p>
          Putar lagu pilihan SHOW Kids, lalu ajak si kecil ikut bernyanyi. Mulai
          dari <strong>{title}</strong>.
        </p>
        <button
          ref={action}
          type="button"
          className={`button ${playing ? "outline" : "green"}`}
          onClick={playing ? close : start}
          aria-controls="singalong-player"
          aria-expanded={playing}
        >
          <Icon name={playing ? "close" : "play"} />
          {playing ? "Tutup video" : "Putar lagu"}
        </button>
      </div>
    </section>
  );
}
