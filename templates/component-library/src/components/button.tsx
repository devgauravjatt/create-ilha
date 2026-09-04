import type { View } from "ilha";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onclick?: (event: MouseEvent) => void;
  children?: View;
}

export const Button = ({
  children,
  disabled = false,
  onclick,
  size = "md",
  type = "button",
  variant = "primary",
}: ButtonProps) => (
  <button
    type={type}
    class={`ui-button ui-button--${variant} ui-button--${size}`}
    disabled={disabled}
    onclick={onclick}
  >
    {children}
  </button>
);
