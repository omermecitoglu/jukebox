import type { Song } from "~/redux/features/library";

export function createMetadata(track: Song) {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      artwork: [
        {
          src: `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`,
          sizes: "480x360",
          type: "image/png",
        },
      ],
    });
  }
}
