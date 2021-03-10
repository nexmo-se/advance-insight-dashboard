import Button from "../base";
import { IButton } from "../base";

function ButtonSecondary({ children, ...props }: IButton) {
  return (
    <Button
      {...props}
      className={["Vlt-btn--secondary"]}
    >
      {children}
    </Button>
  )
}

export default ButtonSecondary;