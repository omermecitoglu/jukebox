import "server-only";
import type { Song } from "~/redux/features/library";
import { isBlacklisted } from "~/server/blacklist";
import { isDownloaded } from "~/server/storage";
import { getRecords } from "./db";
import { requestDownload } from "./downloader";

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
    const records = await getRecords(`track:${videoId}`);
    const trackData = records[`track:${videoId}`];
    if (trackData) {
      return {
        videoId,
        status: "downloaded",
        track: JSON.parse(trackData),
      };
    }
  }
  requestDownload(videoId);
  return {
    videoId,
    status: "downloading",
  };
}

export function inquireBulk(bulk: string[]): Promise<InquiryResult[]> {
  return Promise.all(bulk.map(videoId => inquire(videoId)));
}
