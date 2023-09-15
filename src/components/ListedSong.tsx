import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import React, { useEffect, useState } from "react";
import useNavigatorOnLine from "~/hooks/useNavigatorOnLine";
import type { Song } from "~/redux/features/library";
import CoolButton from "./CoolButton";

type ListedSongProps = {
  song: Song,
  play: (trackId: string) => void,
};

const ListedSong = ({
  song,
  play,
}: ListedSongProps) => {
  const isOnline = useNavigatorOnLine();
  const [isCached, setIsCached] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const cache = await caches.open("workbox-precache-v2-https://brave-rapidly-osprey.ngrok-free.app/");
      const response = await cache.match(`/${song.id}.mp3`);
      setIsCached(response?.ok === true);
    })();
  }, [song]);

  return (
    <tr key={song.id}>
      <td>
        {song.title}
        <br />
        <small className="text-muted">{song.artist}</small>
      </td>
      <td valign="middle">
        {(isOnline || isCached) &&
          <CoolButton icon={faPlay} onClick={() => play(song.id)} />
        }
      </td>
    </tr>
  );
};

export default ListedSong;
