import type { Song } from "~/redux/features/library";

export function createMetadata(track: Song) {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      artwork: [
        {
          src: "https://dummyimage.com/96x96",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "https://dummyimage.com/128x128",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "https://dummyimage.com/192x192",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "https://dummyimage.com/256x256",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "https://dummyimage.com/384x384",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "https://dummyimage.com/512x512",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });
  }
}
