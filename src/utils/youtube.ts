export function getPlaylistId(url: string): string | null {
  const regExp = /[?&]list=([^#?&]*)/;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
}

export function getVideoId(url: string): string | null {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = regex.exec(url);
  return (match && match[7]) ? match[7] : null;
}
