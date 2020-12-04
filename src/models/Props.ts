import { ButtonProps } from "@material-ui/core/Button";

export interface Props extends ButtonProps {
  children?: React.ReactNode;
  className?: string;
  isActive: boolean;
}
