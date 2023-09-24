import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import React, { useEffect, useState } from "react";
import { isMusicCached } from "~/core/cache";
import { getHost } from "~/core/host";
import useNavigatorOnLine from "~/hooks/useNavigatorOnLine";
import { type Song, removeSong } from "~/redux/features/library";
import { useAppDispatch } from "~/redux/hooks";
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
  const [isCached, setIsCached] = useState<boolean | null>(null);
  const [isCaching, setIsCaching] = useState(false);

  useEffect(() => {
    (async () => {
      setIsCached(await isMusicCached(song.id));
    })();
  }, [song]);

  useEffect(() => {
    const controller = new AbortController();
    if (process.env.NODE_ENV === "production" && isCached === false && isOnline) {
      setIsCaching(true);
      setTimeout(() => {
        const url = new URL(`/${song.id}.mp3`, getHost());
        fetch(url, { signal: controller.signal }).then(response => {
          setIsCached(response.status === 200);
        }).catch(() => {
          setIsCached(false);
        }).finally(() => {
          setIsCaching(false);
        });
      }, 1000);
    }
    return () => controller.abort();
  }, [isCached, isOnline]);

  return (
    <tr key={song.id}>
      <td>
        {song.title}
        <br />
        <small className="text-muted">{song.artist}</small>
      </td>
      <td valign="middle">
        {(isOnline || isCached) &&
          <CoolButton icon={faTrash} onClick={() => dispatch(removeSong(song.id))} variant="danger" />
        }
      </td>
      <td valign="middle">
        {(isOnline || isCached) &&
          <CoolButton icon={faPlay} onClick={() => play(song.id)} variant={isCaching ? "warning" : (isCached ? "success" : "primary")} />
        }
      </td>
    </tr>
  );
};

export default ListedSong;
