import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import React, { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { SocketContext } from "~/core/socket";
import { type Song, addSong } from "~/redux/features/library";
import { useAppDispatch } from "~/redux/hooks";
import { addSetValue, getSetValues, removeSetValue } from "../core/storage";
import CoolButton from "./CoolButton";
import DownloadSubscription from "./DownloadSubscription";

type AddSongProps = {
  goBack: () => void,
};

const AddSong = ({
  goBack,
}: AddSongProps) => {
  const socket = useContext(SocketContext);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  const submit = () => {
    if (socket) {
      socket.emit("music:download:start", youtubeLink);
    }
  };

  useEffect(() => {
    setSubscriptions(getSetValues("subscriptions"));

    const addSubscription = (downloadId: string) => {
      addSetValue("subscriptions", downloadId);
      setSubscriptions(c => c.includes(downloadId) ? c : [...c, downloadId]);
    };

    const removeSubscription = (song: Song) => {
      dispatch(addSong(song));
      removeSetValue("subscriptions", song.id);
      setSubscriptions(c => c.filter(i => i !== song.id));
    };

    if (socket) {
      socket.on("music:download:subscription:add", addSubscription);
      socket.on("music:download:subscription:remove", removeSubscription);
    }

    return () => {
      if (socket) {
        socket.off("music:download:subscription:add", addSubscription);
        socket.off("music:download:subscription:remove", removeSubscription);
      }
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
