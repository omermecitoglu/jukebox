import React, { useEffect, useMemo, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import { cacheNextMusic, getCachedMusicList } from "~/core/cache";
import { getHost } from "~/core/host";
import { createMetadata } from "~/core/metadata";
import useNavigatorOnLine from "~/hooks/useNavigatorOnLine";
import { addCachedSongs, cacheSong } from "~/redux/features/app";
import { playNextSong, playPrevSong } from "~/redux/features/player";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import Downloader from "./Downloader";
import Library from "./Library";
import Navigator from "./Navigator";
import Player from "./Player";
import SocketProvider from "./SocketProvider";

const App = () => {
  const isOnline = useNavigatorOnLine();
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [activeScreen, setActiveScreen] = useState("library");
  const isActivated = useAppSelector(state => state.app.active);
  const accessToken = useAppSelector(state => state.user.accessToken);
  const songs = useAppSelector(state => state.library.songs);
  const cachedSongs = useAppSelector(state => state.app.cachedSongs);
  const cacheLoaded = useAppSelector(state => state.app.cacheLoaded);
  const currentTrack = useAppSelector(state => state.player.currentTrack);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const source = audioPlayer.current;
    if (source && currentTrack) {
      const url = new URL(`${currentTrack.id}.mp3`, getHost());
      source.src = url.toString();
      createMetadata(currentTrack);
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        dispatch(playPrevSong());
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        dispatch(playNextSong());
      });
    }
  }, [currentTrack]);

  const content = useMemo(() => {
    switch (activeScreen) {
      case "library": return <Library />;
      case "playlists": return <div>TODO: add playlists feature</div>;
      case "player": return audioPlayer.current && <Player source={audioPlayer.current} />;
      case "downloader": return (
        <SocketProvider>
          <Downloader />
        </SocketProvider>
      );
      case "settings": return <div>{accessToken}</div>;
      default: return <div>Something went wrong.</div>;
    }
  }, [activeScreen]);

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

  if (!isActivated) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {currentTrack &&
        <audio ref={audioPlayer} autoPlay={true} onEnded={() => dispatch(playNextSong())} />
      }
      <main className="flex-grow-1">
        <Container as="section" className="py-3">
          {content}
        </Container>
      </main>
      <Navigator active={activeScreen} setActive={setActiveScreen} />
    </>
  );
};

export default App;
