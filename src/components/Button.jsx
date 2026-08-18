import { classNames } from "../utils/helpers";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  onClick,
  className,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classNames("btn", `btn--${variant}`, `btn--${size}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
