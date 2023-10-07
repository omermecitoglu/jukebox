import "server-only";

type PlayListItem = {
  snippet: {
    resourceId: {
      videoId: string,
    },
  },
};

type PlaylistItems = {
  kind: string,
  nextPageToken?: string,
  items: PlayListItem[],
};

async function getPlaylistItems(pageToken: string | null, playlistId: string, accessToken: string) {
  const url = new URL("/youtube/v3/playlistItems", "https://youtube.googleapis.com");
  url.searchParams.set("part", "snippet");
  if (pageToken) {
    url.searchParams.set("pageToken", pageToken);
  }
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
  return data;
}

export async function getVideoIdsFromPlaylist(playlistId: string, accessToken: string): Promise<string[]> {
  const results = [];
  let currentPageToken: string | null | undefined = null;
  while (typeof currentPageToken !== "undefined") {
    const data = await getPlaylistItems(currentPageToken, playlistId, accessToken);
    for (const item of data.items) {
      results.push(item.snippet.resourceId.videoId);
    }
    currentPageToken = data.nextPageToken;
  }
  return results;
}
