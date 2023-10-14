import { useState } from "react";
import { apiGet } from "~/app/api/fetch";
import { addDownload, addSong, removeDownload } from "~/redux/features/library";
import { useAppDispatch } from "~/redux/hooks";
import type { InquiryResult } from "~/server/inquiry";

const useInquiry = (): [(youtubeLink: string, collection: boolean, accessToken?: string) => Promise<void>, boolean] => {
  const [inquiring, setInquiring] = useState(false);
  const dispatch = useAppDispatch();

  const inquire = async (youtubeLink: string, collection: boolean, accessToken = "") => {
    setInquiring(true);
    try {
      const response = await apiGet<InquiryResult[]>("inquire", {
        youtubeLink,
        collection: collection + "",
        accessToken,
      });
      if (!response.success) {
        return alert(response.error.message);
      }
      for (const result of response.data) {
        switch (result.status) {
          case "downloaded": {
            dispatch(removeDownload(result.track.id));
            dispatch(addSong(result.track));
            break;
          }
          case "downloading": {
            dispatch(addDownload(result.videoId));
            break;
          }
          case "unavailable": {
            dispatch(removeDownload(result.videoId));
            break;
          }
        }
      }
    } finally {
      setInquiring(false);
    }
  };

  return [inquire, inquiring];
};

export default useInquiry;
