import type { Song } from "~/redux/features/library";
import { fixTitle } from "./title";

export function createMetadata(track: Song) {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: fixTitle(track.title),
      artist: track.artist,
      artwork: [
        {
          src: track.thumbnail,
          sizes: "480x360",
          type: "image/png",
        },
      ],
    });
  }
}
