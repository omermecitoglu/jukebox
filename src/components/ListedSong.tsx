import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import React, { useEffect, useState } from "react";
import { isMusicCached } from "~/core/cache";
import { getHost } from "~/core/host";
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
      setIsCached(await isMusicCached(song.id));
    })();
  }, [song]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && isCached === false) {
      const url = new URL(`/${song.id}.mp3`, getHost());
      fetch(url).then(response => setIsCached(response.ok));
    }
  }, [isCached]);

  return (
    <tr key={song.id}>
      <td>
        {song.title}
        <br />
        <small className="text-muted">{song.artist}</small>
      </td>
      <td valign="middle">
        {(isOnline || isCached) &&
          <CoolButton icon={faPlay} onClick={() => play(song.id)} variant={isCached ? "success" : "primary"} />
        }
      </td>
    </tr>
  );
};

export default ListedSong;
