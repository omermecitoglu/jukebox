import React from "react";
import Table from "react-bootstrap/Table";
import type { Song } from "~/redux/features/library";
import { startPlaying } from "~/redux/features/player";
import { useAppDispatch } from "~/redux/hooks";
import ListedSong from "./ListedSong";

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
      trackId,
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
          <ListedSong key={song.id} song={song} play={play} />
        )}
      </tbody>
    </Table>
  );
};

export default SongsList;
