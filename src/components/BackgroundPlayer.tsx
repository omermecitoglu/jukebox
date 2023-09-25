import React, { type RefObject, useEffect } from "react";
import { getHost } from "~/core/host";
import { createMetadata } from "~/core/metadata";
import { playNextSong, playPrevSong } from "~/redux/features/player";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

type BackgroundPlayerProps = {
  ref: RefObject<HTMLAudioElement>,
};

const BackgroundPlayer = ({
  ref,
}: BackgroundPlayerProps) => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector(state => state.player.currentTrack);

  useEffect(() => {
    const source = ref.current;
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

  return <audio ref={ref} autoPlay={true} onEnded={() => dispatch(playNextSong())} />;
};

export default BackgroundPlayer;
