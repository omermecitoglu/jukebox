import { faCirclePlay } from "@fortawesome/free-solid-svg-icons/faCirclePlay";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faListMusic } from "@fortawesome/pro-solid-svg-icons/faListMusic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

type NavigatorProps = {
  active: string,
  setActive: (screenName: string) => void,
};

const Navigator = ({
  active,
  setActive,
}: NavigatorProps) => (
  <Navbar bg="dark" data-bs-theme="dark" className="p-0">
    <Container>
      <Nav activeKey={active} className="w-100 justify-content-between">
        <Nav.Item>
          <Nav.Link eventKey="library">
            <FontAwesomeIcon
              icon={faFolderOpen}
              size="2x"
              className="fa-fw"
              onClick={() => setActive("library")}
            />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="playlists">
            <FontAwesomeIcon
              icon={faListMusic}
              size="2x"
              className="fa-fw"
              onClick={() => setActive("playlists")}
            />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="player">
            <FontAwesomeIcon
              icon={faCirclePlay}
              size="2x"
              className="fa-fw"
              onClick={() => setActive("player")}
            />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="downloader">
            <FontAwesomeIcon
              icon={faDownload}
              size="2x"
              className="fa-fw"
              onClick={() => setActive("downloader")}
            />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="settings">
            <FontAwesomeIcon
              icon={faUser}
              size="2x"
              className="fa-fw"
              onClick={() => setActive("settings")}
            />
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  </Navbar>
);

export default Navigator;
