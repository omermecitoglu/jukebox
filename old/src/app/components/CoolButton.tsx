import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button from "react-bootstrap/Button";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

type BootstrapColorVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark" | "link";

type CoolButtonProps = {
  icon: IconProp,
  label: string,
  variant?: BootstrapColorVariant,
  onClick?: () => void,
};

const CoolButton = ({
  icon,
  label,
  variant = "primary",
  onClick,
}: CoolButtonProps): React.JSX.Element => (
  <Button variant={variant} onClick={onClick}>
    <FontAwesomeIcon icon={icon} size="lg" className="fa-fw me-2" />
    <span className="me-4">{label}</span>
  </Button>
);

export default CoolButton;
