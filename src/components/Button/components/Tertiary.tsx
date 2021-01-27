import Button from "../base";
import { IButton } from "../base";

function ButtonTertiary({ children, ...props }: IButton) {
  return (
    <Button
      {...props}
      className={["Vlt-btn--tertiary"]}
    >
      {children}
    </Button>
  )
}

export default ButtonTertiary;