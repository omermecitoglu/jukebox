import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import AddSong from "./AddSong";
import CoolButton from "./CoolButton";

const App = () => {
  const [adding, setAdding] = useState(false);

  return (
    <Container className="mt-3">
      {adding ? (
        <AddSong goBack={() => setAdding(false)} />
      ) : (
        <div>
          <div className="d-grid gap-3">
            <CoolButton icon={faMusic} label="Add Song" onClick={() => setAdding(true)} />
          </div>
        </div>
      )}
    </Container>
  );
};

export default App;
