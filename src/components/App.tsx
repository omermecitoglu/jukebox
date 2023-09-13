import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import AddSong from "~/components/AddSong";
import CoolButton from "~/components/CoolButton";
import SongsList from "~/components/SongsList";
import { useAppSelector } from "~/redux/hooks";

const App = () => {
  const [adding, setAdding] = useState(false);
  const songs = useAppSelector(state => state.library.songs);

  return (
    <Container className="mt-3">
      {adding ? (
        <AddSong goBack={() => setAdding(false)} />
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
