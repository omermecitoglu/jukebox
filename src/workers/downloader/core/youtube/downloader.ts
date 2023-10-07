import YoutubeMp3Downloader from "youtube-mp3-downloader";

type FinishedDownloadData = {
  videoId: string,
  stats: {
    transferredBytes: number,
    runtime: number,
    averageSpeed: number,
  },
  file: string,
  youtubeUrl: string,
  videoTitle: string,
  artist: string,
  title: string,
  thumbnail: string,
};

export function downloadMp3FromYoutube(
  videoId: string,
  outputPath: string,
  onProgress: (percentage: number) => void,
): Promise<FinishedDownloadData> {
  return new Promise((resolve, reject) => {
    const downloader = new YoutubeMp3Downloader({
      queueParallelism: 1,
      progressTimeout: 1000,
      outputPath,
    });
    downloader.download(videoId, videoId + ".mp3");

    downloader.on("finished", function(err, data: FinishedDownloadData) {
      if (err) return reject(err);
      resolve(data);
    });
    downloader.on("error", function(error) {
      reject(error);
    });
    downloader.on("progress", function(data) {
      onProgress(data.progress.percentage);
    });
  });
}
