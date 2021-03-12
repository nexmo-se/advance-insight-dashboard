import { forwardRef } from "react";
import { DateTime } from "luxon";

import Button from "components/Button";
import { Box } from "@material-ui/core";

const DatePickerInput = forwardRef(({ value, onClick, marginLeft }: any, ref: any) => {
  return (
    <Box
      className="Vlt-dropdown"
      marginLeft={marginLeft? 2: 0}
    >
      <Box className="Vlt-dropdown__trigger Vlt-dropdown__trigger--btn">
        <Button.Tertiary
          onClick={onClick}
          app
        >
          {DateTime.fromFormat(value, "dd/MM/yyyy").toLocaleString(DateTime.DATE_MED)}
        </Button.Tertiary>
      </Box>
    </Box>
  )
});

export default DatePickerInput;
