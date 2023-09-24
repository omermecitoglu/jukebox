import { faBackwardStep } from "@fortawesome/free-solid-svg-icons/faBackwardStep";
import { faForwardStep } from "@fortawesome/free-solid-svg-icons/faForwardStep";
import { faPause } from "@fortawesome/free-solid-svg-icons/faPause";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import React, { useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { playNextSong, playPrevSong } from "~/redux/features/player";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import CoolButton from "./CoolButton";

type PlayerProps = {
  source: HTMLAudioElement,
};

const Player = ({
  source,
}: PlayerProps) => {
  const currentTrack = useAppSelector(state => state.player.currentTrack);
  const [isPlaying, setIsPlaying] = useState(!source.paused);
  const [currentTime, setCurrentTime] = useState(source.currentTime);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const updateIsPlaying = () => {
      setIsPlaying(!source.paused);
    };

    const updateCurrentTime = () => {
      setCurrentTime(source.currentTime);
    };

    source.addEventListener("play", updateIsPlaying);
    source.addEventListener("pause", updateIsPlaying);
    source.addEventListener("timeupdate", updateCurrentTime);

    return () => {
      source.removeEventListener("play", updateIsPlaying);
      source.removeEventListener("pause", updateIsPlaying);
      source.removeEventListener("timeupdate", updateCurrentTime);
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

  const nextSong = () => {
    dispatch(playNextSong());
  };

  const prevSong = () => {
    dispatch(playPrevSong());
  };

  const togglePlaying = () => {
    if (source.paused) {
      source.play();
    } else {
      source.pause();
    }
  };

  if (!currentTrack) return <div>Nothing is playing right now.</div>;

  return (
    <>
      <h4 className="text-truncate">
        {currentTrack.title}
      </h4>
      <h6 className="text-truncate text-muted">
        {currentTrack.artist}
      </h6>
      <img
        src={`https://i.ytimg.com/vi/${currentTrack.id}/hqdefault.jpg`}
        className="mw-100 mb-3"
      />
      <ProgressBar
        variant="danger"
        className="border border-danger"
        animated={isPlaying}
        now={currentTime}
        max={source.duration}
      />
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <CoolButton icon={faBackwardStep} onClick={prevSong} />
          <CoolButton icon={isPlaying ? faPause : faPlay} onClick={togglePlaying} />
          <CoolButton icon={faForwardStep} onClick={nextSong} />
        </div>
        <div>
          {timeFormat(currentTime)} / {timeFormat(source.duration)}
        </div>
      </div>
    </>
  );
};

export default Player;
