import { failResponse, successResponse } from "~/app/api/response";
import { getVideoIds } from "~/server/youtube/videoId";
import { type InquiryResult, inquireBulk } from "../../../server/inquiry";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const youtubeLink = searchParams.get("youtubeLink");
    const collection = searchParams.get("collection");
    const accessToken = searchParams.get("accessToken") || null;
    if (!youtubeLink) {
      throw new Error("Youtube link is not provided!");
    }
    const videoIds = collection === "true" ? youtubeLink.split(",") : await getVideoIds(youtubeLink, accessToken);
    const results = await inquireBulk(videoIds);
    return successResponse<InquiryResult[]>(results);
  } catch (error) {
    return failResponse(error as Error);
  }
}
