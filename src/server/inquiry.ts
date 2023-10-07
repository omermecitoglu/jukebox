import "server-only";
import type { Song } from "~/redux/features/library";
import { isBlacklisted } from "~/server/blacklist";
import { isDownloaded } from "~/server/storage";

type InquiryStatus = "downloaded" | "downloading" | "unavailable";

export type InquiryResult<Status extends InquiryStatus = InquiryStatus> = Status extends "downloaded" ? {
  videoId: string,
  status: Status,
  track: Song,
} : {
  videoId: string,
  status: Status,
};

async function inquire(videoId: string): Promise<InquiryResult> {
  if (await isBlacklisted(videoId)) {
    return {
      videoId,
      status: "unavailable",
    };
  }
  if (await isDownloaded(videoId + ".mp3")) {
    return {
      videoId,
      status: "downloaded",
      track: {
        id: "5",
        title: "anan",
        artist: "x",
        thumbnail: "y",
      },
    };
  }
  // download
  return {
    videoId,
    status: "downloading",
  };
}

export function inquireBulk(bulk: string[]): Promise<InquiryResult[]> {
  return Promise.all(bulk.map(videoId => inquire(videoId)));
}
