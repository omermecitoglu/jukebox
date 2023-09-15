import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import React, { useEffect, useRef } from "react";
import { playNextSong, stopPlaying } from "~/redux/features/player";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import CoolButton from "./CoolButton";

const Player = () => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const currentTrack = useAppSelector(state => state.player.currentTrack);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(currentTrack);
    if (audioPlayer.current) {
      audioPlayer.current.src = new URL(`${currentTrack}.mp3`, window.location.href).toString();
    }
  }, [currentTrack]);

  const goBack = () => {
    dispatch(stopPlaying());
  };

  const handleEnding = () => {
    dispatch(playNextSong());
  };

  return (
    <>
      <audio ref={audioPlayer} controls autoPlay onEnded={handleEnding}>
        Your browser does not support the audio element.
      </audio>
      <div className="d-grid gap-3 mt-3">
        <CoolButton icon={faChevronLeft} label="Back" onClick={goBack} variant="secondary" />
      </div>
    </>
  );
};

export default Player;
