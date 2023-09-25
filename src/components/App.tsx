import React, { useMemo, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import { useCacheResolver } from "~/hooks/useCacheResolver";
import { useAppSelector } from "~/redux/hooks";
import BackgroundPlayer from "./BackgroundPlayer";
import DownloadTracker from "./DownloadTracker";
import Downloader from "./Downloader";
import Library from "./Library";
import Loading from "./Loading";
import Navigator from "./Navigator";
import Player from "./Player";
import SocketProvider from "./SocketProvider";

const App = () => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [activeScreen, setActiveScreen] = useState("library");
  const isActivated = useAppSelector(state => state.app.active);
  const accessToken = useAppSelector(state => state.user.accessToken);
  const currentTrack = useAppSelector(state => state.player.currentTrack);
  useCacheResolver();

  const content = useMemo(() => {
    switch (activeScreen) {
      case "library": return <Library />;
      case "playlists": return <div>TODO: add playlists feature</div>;
      case "player": return audioPlayer.current && <Player source={audioPlayer.current} />;
      case "downloader": return <Downloader />;
      case "settings": return <div>{accessToken}</div>;
      default: return <div>Something went wrong.</div>;
    }
  }, [activeScreen]);

  if (!isActivated) {
    return <Loading />;
  }

  return (
    <SocketProvider>
      <DownloadTracker />
      {currentTrack &&
        <BackgroundPlayer ref={audioPlayer} />
      }
      <main className="flex-grow-1">
        <Container as="section" className="py-3">
          {content}
        </Container>
      </main>
      <Navigator active={activeScreen} setActive={setActiveScreen} />
    </SocketProvider>
  );
};

export default App;
