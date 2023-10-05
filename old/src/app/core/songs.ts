export type Song = {
  id: string,
  artist: string,
  title: string,
};

export function getSongs(): Song[] {
  const item = localStorage.getItem("songs");
  if (!item) return [];
  return JSON.parse(item);
}

export function addSong(song: Song) {
  const songs = getSongs();
  const found = songs.find(s => s.id === song.id);
  if (!found) {
    songs.push(song);
  }
  localStorage.setItem("songs", JSON.stringify(songs));
  return songs;
}

export function removeSong(songId: string) {
  const songs = getSongs();
  const newSongs = songs.filter(s => s.id !== songId);
  if (newSongs.length) {
    localStorage.setItem("songs", JSON.stringify(songs));
  } else {
    localStorage.removeItem("songs");
  }
}
