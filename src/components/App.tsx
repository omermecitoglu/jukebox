import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import AddSong from "~/components/AddSong";
import CoolButton from "~/components/CoolButton";
import SongsList from "~/components/SongsList";
import useNavigatorOnLine from "~/hooks/useNavigatorOnLine";
import { useAppSelector } from "~/redux/hooks";

const App = () => {
  const isOnline = useNavigatorOnLine();
  const [adding, setAdding] = useState(false);
  const songs = useAppSelector(state => state.library.songs);

  const goBack = () => setAdding(false);

  return (
    <Container className="mt-3">
      {adding ? (
        isOnline ? (
          <AddSong goBack={goBack} />
        ) : (
          <div>
            <p>You can't add songs in offline mode</p>
            <div className="d-grid gap-3">
              <CoolButton icon={faChevronLeft} label="Back" onClick={goBack} variant="secondary" />
            </div>
          </div>
        )
      ) : (
        <div className="d-grid gap-3">
          {isOnline &&
            <div className="d-grid gap-3">
              <CoolButton icon={faMusic} label="Add Song" onClick={() => setAdding(true)} />
            </div>
          }
          <SongsList collection={songs} />
        </div>
      )}
    </Container>
  );
};

export default App;
