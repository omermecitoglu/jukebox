import React from "react";
import Table from "react-bootstrap/Table";
import type { Song } from "~/redux/features/library";
import { startPlaying } from "~/redux/features/player";
import { useAppDispatch } from "~/redux/hooks";
import ListedSong from "./ListedSong";

type SongsListProps = {
  title: string,
  collection: Song[],
};

const SongsList = ({
  title,
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
    <Table className="mb-0">
      <thead>
        <tr>
          <th>{title}</th>
          <th colSpan={2} className="text-muted text-end">
            <small>{collection.length} songs</small>
          </th>
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
