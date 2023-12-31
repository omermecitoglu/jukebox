import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import Button from "react-bootstrap/Button";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

type BootstrapColorVariant =
  "primary" |
  "outline-primary" |
  "secondary" |
  "outline-secondary" |
  "success" |
  "outline-success" |
  "warning" |
  "outline-warning" |
  "danger" |
  "outline-danger" |
  "info" |
  "outline-info" |
  "light" |
  "outline-light" |
  "dark" |
  "outline-dark" |
  "link";

type CoolButtonProps = {
  icon: IconProp,
  label?: string,
  variant?: BootstrapColorVariant,
  size?: "xs" | "sm" | "lg" | "2x" | "3x" | "5x" | "7x" | "10x",
  onClick?: () => void,
  disabled?: boolean,
  spinning?: boolean,
};

const CoolButton = ({
  icon,
  label,
  variant = "primary",
  size = "lg",
  onClick,
  disabled = false,
  spinning = false,
}: CoolButtonProps): React.JSX.Element => (
  <Button variant={variant} onClick={onClick} disabled={disabled}>
    <FontAwesomeIcon
      size={size}
      icon={spinning ? faSpinner : icon}
      className={classNames("fa-fw", {
        "fa-spin": spinning,
      })}
    />
    {label && <span className="ms-2 me-4">{label}</span>}
  </Button>
);

export default CoolButton;
