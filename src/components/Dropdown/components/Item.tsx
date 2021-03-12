import clsx from "clsx";
import { MouseEvent } from "react";

import { Box } from "@material-ui/core";

interface ItemProps {
  selected?: boolean;
  value: string | null;
  label?: string;
  key?: string;
  onClick?: (item: any) => void;
}

function Item ({ selected = false, value, key, label, onClick }: ItemProps) {
  function handleClick (e: MouseEvent<HTMLDivElement>) {
    if (onClick) onClick({ value, label })
  }
  
  return (
    <Box
      className={
        clsx({
          "Vlt-dropdown__link": true,
          "Vlt-dropdown__link--selected": selected
        })
      }
      onClick={handleClick}
      key={key}
    >
      { label? label: value }
    </Box>
  )
}

export default Item;
