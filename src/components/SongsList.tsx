import React from "react";
import Table from "react-bootstrap/Table";
import type { Song } from "~/redux/features/library";

type SongsListProps = {
  collection: Song[],
};

const SongsList = ({
  collection,
}: SongsListProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Track</th>
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
            <td>X</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default SongsList;
