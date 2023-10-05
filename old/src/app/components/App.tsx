import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { type Song, getSongs } from "../core/songs";
import AddSong from "./AddSong";
import CoolButton from "./CoolButton";
import SongsList from "./SongsList";

const App = () => {
  const [adding, setAdding] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    setSongs(getSongs());

    return () => {
      // .
    };
  }, []);

  return (
    <Container className="mt-3">
      {adding ? (
        <AddSong setSongs={setSongs} goBack={() => setAdding(false)} />
      ) : (
        <div className="d-grid gap-3">
          <div className="d-grid gap-3">
            <CoolButton icon={faMusic} label="Add Song" onClick={() => setAdding(true)} />
          </div>
          <SongsList collection={songs} />
        </div>
      )}
    </Container>
  );
};

export default App;
