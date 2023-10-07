import { faPause } from "@fortawesome/free-solid-svg-icons/faPause";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import React from "react";
import { fixTitle } from "~/core/title";
import useNavigatorOnLine from "~/hooks/useNavigatorOnLine";
import { type Song, removeSong } from "~/redux/features/library";
import { stopPlaying } from "~/redux/features/player";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import CoolButton from "./CoolButton";

type ListedSongProps = {
  song: Song,
  play: (trackId: string) => void,
};

const ListedSong = ({
  song,
  play,
}: ListedSongProps) => {
  const dispatch = useAppDispatch();
  const isOnline = useNavigatorOnLine();
  const currentTrack = useAppSelector(state => state.player.currentTrack);
  const prospectSong = useAppSelector(state => state.app.prospectSong);
  const cachedSongs = useAppSelector(state => state.app.cachedSongs);
  const isCached = cachedSongs.includes(song.id);
  const isCaching = song.id === prospectSong;

  const toggle = () => {
    if (song === currentTrack) {
      dispatch(stopPlaying());
    } else {
      play(song.id);
    }
  };

  const getPlayButtonColor = () => {
    if (isCaching) return "warning";
    if (isCached) return "success";
    if (isOnline) return "primary";
    return "secondary";
  };

  return (
    <tr key={song.id}>
      <td className="ellipsis" valign="middle">
        <div>
          <span className="lh-sm">
            <span className="fw-bold">{fixTitle(song.title)}</span>
            <br />
            <small className="text-muted">{song.artist}</small>
          </span>
        </div>
      </td>
      <td valign="middle">
        <CoolButton
          variant="danger"
          icon={faTrash}
          onClick={() => dispatch(removeSong(song.id))}
        />
      </td>
      <td valign="middle">
        <CoolButton
          variant={getPlayButtonColor()}
          icon={song === currentTrack ? faPause : faPlay}
          onClick={toggle}
          disabled={!isOnline && !isCached}
        />
      </td>
    </tr>
  );
};

export default ListedSong;
