import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import React from "react";
import Table from "react-bootstrap/Table";
import CoolButton from "~/components/CoolButton";
import type { Song } from "~/redux/features/library";
import { startPlaying } from "~/redux/features/player";
import { useAppDispatch } from "~/redux/hooks";

type SongsListProps = {
  collection: Song[],
};

const SongsList = ({
  collection,
}: SongsListProps) => {
  const dispatch = useAppDispatch();
  const play = (trackId: string) => {
    dispatch(startPlaying({
      playlist: collection,
      currentTrack: trackId,
    }));
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>My Songs</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {collection.map(song =>
          <tr key={song.id}>
            <td>
              {song.title}
              <br />
              <small className="text-muted">{song.artist}</small>
            </td>
            <td valign="middle">
              <CoolButton icon={faPlay} onClick={() => play(song.id)} />
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default SongsList;
