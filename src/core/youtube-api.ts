import fetch from "node-fetch";

type PlayListItem = {
  snippet: {
    resourceId: {
      videoId: string,
    },
  },
};

type PlaylistItems = {
  kind: string,
  items: PlayListItem[],
};

export async function getVideoIdsFromPlaylist(playlistId: string, accessToken: string) {
  const url = new URL("/youtube/v3/playlistItems", "https://youtube.googleapis.com");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", "50");
  url.searchParams.set("key", playlistId);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  const data = await response.json() as PlaylistItems;
  if (data.kind !== "youtube#playlistItemListResponse") {
    throw new Error("Invalid Playlist Item List Response");
  }
  return data.items.map(i => i.snippet.resourceId.videoId);
}
