import lodash from "lodash";
import { DropdownItem } from "types/Dropdown";
import { useEffect, cloneElement } from "react";

import Item from "./components/Item";
import { Box } from "@material-ui/core";

interface DropdownProps {
  value: DropdownItem;
  onChange?: (selected: DropdownItem) => void;
  children?: any;
}

function Dropdown ({ value, children, onChange }: DropdownProps) {
  function handleClick (item: DropdownItem) {
    if (onChange) onChange(item);
  }

  useEffect(
    () => {
      (window as any).Volta.init(["dropdown"])
    },
    []
  )


  return (
    <Box className="Vlt-dropdown">
      <Box className="Vlt-dropdown__trigger Vlt-dropdown__trigger--btn">
        <button className="Vlt-btn Vlt-btn--app Vlt-btn--outline Vlt-btn--secondary">
          {value.label? value.label: value.value}
        </button>
      </Box>
      <Box className="Vlt-dropdown__panel">
        <Box className="Vlt-dropdown__panel__content">
          {
            children.length > 1? 
              lodash.flatten(children).map(
                (child: any) => {
                  return cloneElement(child, {
                    onClick: handleClick,
                    selected: value.value === child.value,
                  });
                }
              )
            : cloneElement(children, {
              onClick: handleClick,
              selected: value.value === children.value,
            })
          }
        </Box>
      </Box>
    </Box>
  )
}

Dropdown.Item = Item;
export default Dropdown;
