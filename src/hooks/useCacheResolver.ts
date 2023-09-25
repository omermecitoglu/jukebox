import { useEffect } from "react";
import { cacheNextMusic, getCachedMusicList } from "~/core/cache";
import { addCachedSongs, cacheSong } from "~/redux/features/app";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import useNavigatorOnLine from "./useNavigatorOnLine";

export function useCacheResolver() {
  const isOnline = useNavigatorOnLine();
  const songs = useAppSelector(state => state.library.songs);
  const cachedSongs = useAppSelector(state => state.app.cachedSongs);
  const cacheLoaded = useAppSelector(state => state.app.cacheLoaded);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getCachedMusicList().then(list => dispatch(addCachedSongs(list)));
  }, []);

  useEffect(() => {
    if (!isOnline || !cacheLoaded) return;
    const controller = new AbortController();
    cacheNextMusic({
      trackIds: songs.map(s => s.id),
      cache: cachedSongs,
      signal: controller.signal,
      markProspect: trackId => dispatch(cacheSong(trackId)),
      resolve: trackId => dispatch(addCachedSongs([trackId])),
    });
    return () => controller.abort();
  }, [isOnline, cacheLoaded, songs, cachedSongs]);
}
