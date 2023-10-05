import React from "react";
import { useAppSelector } from "~/redux/hooks";
import SongsList from "./SongsList";

const Library = () => {
  const songs = useAppSelector(state => state.library.songs);
  return <SongsList title="My Library" collection={songs} />;
};

export default Library;
