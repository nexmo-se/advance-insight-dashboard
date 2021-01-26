import clsx from "clsx";

export interface IButton {
  children: any;
  app?: boolean;
  outline?: boolean;
  className?: string[];
  onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | ((e: React.MouseEvent<HTMLButtonElement>) => Promise<any>) | (() => void)
}

function Button({ onClick, children, className = [], app, outline }: IButton) {
  return (
    <button
      className={
        clsx(
          "Vlt-btn",
          ...className,
          app? "Vlt-btn--app": "",
          outline? "Vlt-btn--outline": ""
        )
      }
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button;
