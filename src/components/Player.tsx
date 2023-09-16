import { faBackwardStep } from "@fortawesome/free-solid-svg-icons/faBackwardStep";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faForwardStep } from "@fortawesome/free-solid-svg-icons/faForwardStep";
import { faPause } from "@fortawesome/free-solid-svg-icons/faPause";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { createMetadata } from "~/core/metadata";
import { playNextSong, playPrevSong, stopPlaying } from "~/redux/features/player";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import CoolButton from "./CoolButton";

const Player = () => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const currentTrack = useAppSelector(state => state.player.currentTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (audioPlayer.current && currentTrack) {
      const host = process.env.NODE_ENV === "production" ? window.location.href : "http://localhost:7701";
      audioPlayer.current.src = new URL(`${currentTrack.id}.mp3`, host).toString();
      createMetadata(currentTrack);
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        dispatch(playNextSong());
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        dispatch(playPrevSong());
      });
    }
  }, [currentTrack]);

  useEffect(() => {
    const updateIsPlaying = () => {
      if (audioPlayer.current) {
        setIsPlaying(!audioPlayer.current.paused);
      }
    };

    const updateCurrentTime = () => {
      setCurrentTime(audioPlayer.current?.currentTime ?? 0);
    };

    if (audioPlayer.current) {
      audioPlayer.current.addEventListener("play", updateIsPlaying);
      audioPlayer.current.addEventListener("pause", updateIsPlaying);
      audioPlayer.current.addEventListener("timeupdate", updateCurrentTime);
    }

    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.removeEventListener("play", updateIsPlaying);
        audioPlayer.current.removeEventListener("pause", updateIsPlaying);
        audioPlayer.current.removeEventListener("timeupdate", updateCurrentTime);
      }
    };
  }, []);

  const timeFormat = (seconds: number) => {
    seconds = Math.round(isNaN(seconds) ? 0 : seconds);
    const date = new Date(seconds * 1000);
    if (seconds < 3600) {
      return date.toISOString().slice(14, 19);
    }
    return date.toISOString().slice(11, 19);
  };

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
      <audio ref={audioPlayer} autoPlay={true} onEnded={nextSong} />
      <ProgressBar variant="danger" animated={isPlaying} now={currentTime} max={audioPlayer.current?.duration ?? 100} />
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <CoolButton icon={faBackwardStep} onClick={prevSong} />
          <CoolButton icon={isPlaying ? faPause : faPlay} onClick={togglePlaying} />
          <CoolButton icon={faForwardStep} onClick={nextSong} />
        </div>
        <div>
          {timeFormat(currentTime)} / {timeFormat(audioPlayer.current?.duration ?? 0)}
        </div>
      </div>
      <div className="d-grid gap-3 mt-3">
        <CoolButton icon={faChevronLeft} label="Back" onClick={goBack} variant="secondary" />
      </div>
    </>
  );
};

export default Player;
