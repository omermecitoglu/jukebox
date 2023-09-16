import { faBackwardStep } from "@fortawesome/free-solid-svg-icons/faBackwardStep";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faForwardStep } from "@fortawesome/free-solid-svg-icons/faForwardStep";
import { faPause } from "@fortawesome/free-solid-svg-icons/faPause";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import React, { useEffect, useRef, useState } from "react";
import { playNextSong, playPrevSong, stopPlaying } from "~/redux/features/player";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import CoolButton from "./CoolButton";

const Player = () => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const currentTrack = useAppSelector(state => state.player.currentTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(currentTrack);
    if (audioPlayer.current) {
      audioPlayer.current.src = new URL(`${currentTrack}.mp3`, window.location.href).toString();
    }
  }, [currentTrack]);

  useEffect(() => {
    const updateIsPlaying = () => {
      if (audioPlayer.current) {
        setIsPlaying(audioPlayer.current.paused);
      }
    };

    if (audioPlayer.current) {
      audioPlayer.current.addEventListener("play", updateIsPlaying);
      audioPlayer.current.addEventListener("pause", updateIsPlaying);
    }

    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.removeEventListener("play", updateIsPlaying);
        audioPlayer.current.removeEventListener("pause", updateIsPlaying);
      }
    };
  }, []);

  const goBack = () => {
    dispatch(stopPlaying());
  };

  const nextSong = () => {
    dispatch(playNextSong());
  };

  const prevSong = () => {
    dispatch(playPrevSong());
  };

  const togglePlaying = () => {
    if (audioPlayer.current) {
      if (audioPlayer.current.paused) {
        audioPlayer.current.play();
      } else {
        audioPlayer.current.pause();
      }
    }
  };

  return (
    <>
      <audio ref={audioPlayer} controls autoPlay onEnded={nextSong}>
        Your browser does not support the audio element.
      </audio>
      <div className="d-flex gap-3 mt-3">
        <CoolButton icon={faBackwardStep} onClick={prevSong} />
        <CoolButton icon={isPlaying ? faPause : faPlay} onClick={togglePlaying} />
        <CoolButton icon={faForwardStep} onClick={nextSong} />
      </div>
      <div className="d-grid gap-3 mt-3">
        <CoolButton icon={faChevronLeft} label="Back" onClick={goBack} variant="secondary" />
      </div>
    </>
  );
};

export default Player;
