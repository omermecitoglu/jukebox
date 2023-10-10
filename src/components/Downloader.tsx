import { faBroom } from "@fortawesome/free-solid-svg-icons/faBroom";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { apiGet } from "~/app/api/fetch";
import { idealHeight, openCentered } from "~/core/open";
import { generateAuthUrl } from "~/core/youtube";
import useNavigatorOnLine from "~/hooks/useNavigatorOnLine";
import { addDownload, addSong, clearDownloads } from "~/redux/features/library";
import { injectAccessToken } from "~/redux/features/user";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import type { InquiryResult } from "~/server/inquiry";
import { getPlaylistId } from "~/utils/youtube";
import CoolButton from "./CoolButton";
import DownloadSubscription from "./DownloadSubscription";

declare global {
  interface Window {
    injectToken?: (token: string) => void,
  }
}

const Downloader = () => {
  const isOnline = useNavigatorOnLine();
  const accessToken = useAppSelector(state => state.user.accessToken);
  const subscriptions = useAppSelector(state => state.library.downloads);
  const [inquiring, setInquiring] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const dispatch = useAppDispatch();
  const popup = useRef<Window>();

  const authenticate = () => {
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
  };

  const submit = async () => {
    const isPlaylist = getPlaylistId(youtubeLink) !== null;
    if (isPlaylist && !accessToken) {
      return authenticate();
    }

    setYoutubeLink("");
    setInquiring(true);
    try {
      const response = await apiGet<InquiryResult[]>("/inquire",
        accessToken ? { youtubeLink, accessToken } : { youtubeLink });
      if (!response.success) {
        return alert(response.error.message);
      }
      for (const result of response.data) {
        switch (result.status) {
          case "downloaded": {
            dispatch(addSong(result.track));
            break;
          }
          case "downloading": {
            dispatch(addDownload(result.videoId));
            break;
          }
        }
      }
    } finally {
      setInquiring(false);
    }
  };

  return (
    <div className="mh-100 d-flex flex-column gap-3">
      <div className="d-grid gap-3">
        <Form.Group controlId="youtube-link">
          <Form.Control
            type="text"
            placeholder="paste youtube link here"
            value={youtubeLink}
            onChange={e => setYoutubeLink(e.target.value)}
            readOnly={inquiring}
          />
        </Form.Group>
        <CoolButton
          icon={faDownload}
          label="Download"
          variant="success"
          onClick={submit}
          disabled={!isOnline || inquiring}
        />
        <CoolButton
          icon={faBroom}
          label="Clear"
          variant="danger"
          onClick={() => dispatch(clearDownloads())}
        />
      </div>
      <div className="flex-shrink-1 overflow-hidden d-grid gap-1">
        {subscriptions.map(download =>
          <DownloadSubscription key={download.videoId} download={download} />
        )}
      </div>
    </div>
  );
};

export default Downloader;
