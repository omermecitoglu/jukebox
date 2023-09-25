import { faBroom } from "@fortawesome/free-solid-svg-icons/faBroom";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import React, { useContext, useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { idealHeight, openCentered } from "~/core/open";
import { SocketContext } from "~/core/socket";
import { generateAuthUrl } from "~/core/youtube";
import { addDownload, clearDownloads } from "~/redux/features/library";
import { injectAccessToken } from "~/redux/features/user";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import CoolButton from "./CoolButton";
import DownloadSubscription from "./DownloadSubscription";

const Downloader = () => {
  const accessToken = useAppSelector(state => state.user.accessToken);
  const subscriptions = useAppSelector(state => state.library.downloads);
  const [youtubeLink, setYoutubeLink] = useState("");
  const socket = useContext(SocketContext);
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
    if (!socket) return;

    const addSubscription = (downloadId: string) => {
      dispatch(addDownload(downloadId));
    };

    socket.emit("music:download:subscribe", subscriptions);
    socket.on("music:download:subscription:add", addSubscription);

    return () => {
      socket.off("music:download:subscription:add", addSubscription);
    };
  }, [socket]);

  return (
    <div className="mh-100 d-flex flex-column gap-3">
      <div className="d-grid gap-3">
        <Form.Group controlId="youtube-link">
          <Form.Control
            type="text"
            placeholder="paste youtube link here"
            value={youtubeLink}
            onChange={e => setYoutubeLink(e.target.value)}
          />
        </Form.Group>
        <CoolButton
          icon={faDownload}
          label="Download"
          variant="success"
          onClick={submit}
          disabled={!socket}
        />
        <CoolButton
          icon={faBroom}
          label="Clear"
          variant="danger"
          onClick={() => dispatch(clearDownloads())}
        />
      </div>
      <div className="flex-shrink-1 overflow-hidden d-grid gap-1">
        {subscriptions.map(downloadId =>
          <DownloadSubscription key={downloadId} downloadId={downloadId} />
        )}
      </div>
    </div>
  );
};

export default Downloader;
