import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Loading = () => {
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
      <div style={{ color: "red" }}>
        <FontAwesomeIcon icon={faMusic} size="10x" className="fa-fw fa-beat-fade" />
      </div>
    </div>
  );
};

export default Loading;
