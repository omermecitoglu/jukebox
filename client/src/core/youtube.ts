export function generateAuthUrl(clientID: string) {
  const url = new URL("/o/oauth2/auth", "https://accounts.google.com");
  url.searchParams.set("client_id", clientID);
  url.searchParams.set("redirect_uri", window.location.href);
  const scopes: string[] = [
    "https://www.googleapis.com/auth/youtube.readonly",
  ];
  url.searchParams.set("scope", scopes.join(","));
  url.searchParams.set("response_type", "token");
  return url.toString();
}
