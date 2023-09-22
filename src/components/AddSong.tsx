import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import React, { useContext, useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { idealHeight, openCentered } from "~/core/open";
import { SocketContext } from "~/core/socket";
import { generateAuthUrl } from "~/core/youtube";
import { type Song, addDownload, addSong, removeDownload } from "~/redux/features/library";
import { injectAccessToken } from "~/redux/features/user";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
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
  const accessToken = useAppSelector(state => state.user.accessToken);
  const subscriptions = useAppSelector(state => state.library.downloads);
  const dispatch = useAppDispatch();
  const popup = useRef<Window>();

  const submit = () => {
    if (!socket) return alert("Socket is not connected!");
    const isPlaylist = /[?&]list=([^#?&]*)/.test(youtubeLink);
    if (isPlaylist && !accessToken) {
      const url = generateAuthUrl("69846603813-nq3tculv936hmsgtrdq2n3hbg7p1fe05.apps.googleusercontent.com");
      popup.current = openCentered(url, "_blank", 600, idealHeight(), {
        popup: "yes",
        titlebar: "no",
        location: "no",
        toolbar: "no",
        menubar: "no",
      });
      window.injectToken = (token) => {
        dispatch(injectAccessToken(token));
        window.injectToken = undefined;
      };
    } else {
      setYoutubeLink("");
      socket.emit("music:download:request", youtubeLink, accessToken);
    }
  };

  useEffect(() => {
    const addSubscription = (downloadId: string) => {
      dispatch(addDownload(downloadId));
    };

    const removeSubscription = (song: Song) => {
      dispatch(addSong(song));
      dispatch(removeDownload(song.id));
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
  }, [socket]);

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
