import "server-only";
import { getVideoIdsFromPlaylist } from "~/server/youtube/api-v3";
import { getPlaylistId, getVideoId } from "~/utils/youtube";

export async function getVideoIds(url: string, youtubeToken: string | null): Promise<string[]> {
  try {
    const playlistId = getPlaylistId(url);
    if (playlistId) {
      if (!youtubeToken) throw new Error("Youtube Access Token is not provided.");
      const videoIds = await getVideoIdsFromPlaylist(playlistId, youtubeToken);
      return videoIds;
    } else {
      const videoId = getVideoId(url);
      if (!videoId) throw new Error("Invalid Youtube URL");
      return [videoId];
    }
  } catch {
    return [];
  }
}
