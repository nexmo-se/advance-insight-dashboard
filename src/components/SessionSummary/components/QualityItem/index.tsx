import useStyles from "./styles";
import clsx from "clsx";
import { Grid } from "@material-ui/core";

interface QualityItemProps {
  label: string;
  value: any;
}

function QualityItem ({ label, value }: QualityItemProps) {
  const mStyles = useStyles();
  return (
    <Grid container>
      <Grid xs={5} item>
        <p
          className={
            clsx("p-large", mStyles.noMargin)
          }
        >
          <strong>{label}</strong>
        </p>
      </Grid>
      <Grid xs={7} item>
        <p
          className={
            clsx("p-large", "Vlt-orange", mStyles.noMargin)
          }
        >
          {<strong>{value}</strong>}
        </p>
      </Grid>
    </Grid>
  )
}

export default QualityItem;