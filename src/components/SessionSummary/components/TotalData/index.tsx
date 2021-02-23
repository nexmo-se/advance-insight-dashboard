import lodash from "lodash";

import useStyles from "./styles";
import { Box } from "@material-ui/core";

type Breakdown = {
  title: string;
  value: string | number;
}

interface TotalDataProps {
  type: "minutes" | "connections" | string,
  total: number | string;
  breakdown: Breakdown[]
}

function TotalData ({ type, total, breakdown }: TotalDataProps) {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
    >
      <h3 className={classes.noMargin}>
        Total <br />
        {lodash.startCase(type)}
      </h3>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex">
          <p className={classes.totalMinutesStyle}>
            {total}
          </p>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          ml={2}
        >
          {
            breakdown.map(
              (data) => (
                <Box display="flex" key={data.title}>
                  <p>
                    <b>{data.title} &nbsp;</b>
                  </p>
                  <p>{data.value}</p>
                </Box>
              )
            )
          }
        </Box>
      </Box>
    </Box>
  )
}

export default TotalData;
