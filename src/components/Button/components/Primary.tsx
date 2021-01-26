import Button from "../base";
import { IButton } from "../base";

function ButtonPrimary({ children, ...props }: IButton) {
  return (
    <Button
      {...props}
      className={["Vlt-btn--primary"]}
    >
      {children}
    </Button>
  )
}

export default ButtonPrimary;