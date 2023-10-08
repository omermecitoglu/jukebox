import { failResponse, successResponse } from "~/app/api/response";
import { getRecords } from "~/server/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("v");
    if (!videoId) throw new Error("Video ID was not provided!");
    const key = "download:progress:" + videoId;
    const records = await getRecords(key);
    const record = records[key];
    if (!record) throw new Error("Record was not found!");
    const progress = parseInt(record);
    return successResponse(progress);
  } catch (error) {
    return failResponse(error as Error);
  }
}
