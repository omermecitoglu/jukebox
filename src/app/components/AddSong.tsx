import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { socket } from "~/app/core/socket";
import { type Song, addSong } from "../core/songs";
import { addSetValue, getSetValues, removeSetValue } from "../core/storage";
import CoolButton from "./CoolButton";
import DownloadSubscription from "./DownloadSubscription";

type AddSongProps = {
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>,
  goBack: () => void,
};

const AddSong = ({
  setSongs,
  goBack,
}: AddSongProps) => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  const submit = () => {
    socket.emit("music:download:start", youtubeLink);
  };

  useEffect(() => {
    setSubscriptions(getSetValues("subscriptions"));

    const addSubscription = (downloadId: string) => {
      addSetValue("subscriptions", downloadId);
      setSubscriptions(c => c.includes(downloadId) ? c : [...c, downloadId]);
    };

    const removeSubscription = (song: Song) => {
      setSongs(addSong(song));
      removeSetValue("subscriptions", song.id);
      setSubscriptions(c => c.filter(i => i !== song.id));
    };

    socket.on("music:download:subscription:add", addSubscription);
    socket.on("music:download:subscription:remove", removeSubscription);

    return () => {
      socket.off("music:download:subscription:add", addSubscription);
      socket.off("music:download:subscription:remove", removeSubscription);
    };
  }, []);

  return (
    <>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Control
          type="text"
          placeholder="paste youtube link here"
          value={youtubeLink}
          onChange={e => setYoutubeLink(e.target.value)}
        />
      </Form.Group>
      <div className="d-grid gap-3">
        <CoolButton icon={faDownload} label="Download" onClick={submit} variant="success" />
        <CoolButton icon={faChevronLeft} label="Back" onClick={goBack} variant="secondary" />
      </div>
      <div className="d-grid gap-3 mt-3">
        {subscriptions.map(downloadId =>
          <DownloadSubscription key={downloadId} downloadId={downloadId} />
        )}
      </div>
    </>
  );
};

export default AddSong;
