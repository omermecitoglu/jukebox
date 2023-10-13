import "client-only";

type UserSnippetData = {
  items: Array<{
    snippet: {
      title: string,
      customUrl: string,
      thumbnails: {
        default: {
          url: string,
        },
      },
    },
  }>,
  error?: {
    code: number,
    status: string,
  },
};

export async function getUserInfo(accessToken: string) {
  const url = new URL("/youtube/v3/channels", "https://www.googleapis.com");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("mine", "true");
  url.searchParams.set("access_token", accessToken);
  const response = await fetch(url);
  const data: UserSnippetData = await response.json();
  if (data.error) throw new Error(data.error.status);
  return data;
}

export function generateAuthUrl() {
  const url = new URL("/o/oauth2/auth", "https://accounts.google.com");
  url.searchParams.set("client_id", process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || "");
  url.searchParams.set("redirect_uri", window.location.href);
  const scopes: string[] = [
    "https://www.googleapis.com/auth/youtube.readonly",
  ];
  url.searchParams.set("scope", scopes.join(","));
  url.searchParams.set("response_type", "token");
  return url.toString();
}
