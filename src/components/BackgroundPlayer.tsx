import React, { type RefObject, useEffect } from "react";
import { createMetadata } from "~/core/metadata";
import { playNextSong, playPrevSong } from "~/redux/features/player";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

type BackgroundPlayerProps = {
  audioRef: RefObject<HTMLAudioElement>,
};

const BackgroundPlayer = ({
  audioRef,
}: BackgroundPlayerProps) => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector(state => state.player.currentTrack);

  useEffect(() => {
    const source = audioRef.current;
    if (source && currentTrack) {
      const url = new URL(`${currentTrack.id}.mp3`, window.location.origin);
      source.src = url.toString();
      createMetadata(currentTrack);
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        dispatch(playPrevSong());
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        dispatch(playNextSong());
      });
    }
  }, [audioRef, currentTrack]);

  return <audio ref={audioRef} autoPlay={true} onEnded={() => dispatch(playNextSong())} />;
};

export default BackgroundPlayer;
