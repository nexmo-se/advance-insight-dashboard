import useStyles from "./styles";

import QualityItem from "../QualityItem";
import { Box, Grid } from "@material-ui/core";

function QuickQualityView () {
  const mStyles = useStyles();

  return (
    <Box className={mStyles.container}>
      <Box
        display="flex"
        alignItems="flex-end"
      >
        <h3 className={mStyles.noMargin}>Quality</h3> &nbsp;
        <p className={mStyles.noMargin}>(MOS)</p>
      </Box>
      <Box m={2} />
      <Grid spacing={2} container>
        <Grid xs={6} item>
          <h3 className={mStyles.noMargin}>
            Video Subscriber
          </h3>
          <QualityItem
            label="Avg MOS"
            value={(
              <>
                2.1 <span className="Vlt-black">(1.1 - 2.9)</span>
              </>
            )}
          />

          <QualityItem
            label="Avg Bitrate"
            value="1.2Mbps"
          />

          <QualityItem
            label="Avg Latency"
            value="80ms"
          />
        </Grid>
        <Grid xs={6} item>
          <h3 className={mStyles.noMargin}>
            Audio Subscriber
          </h3>
          <QualityItem
            label="Avg MOS"
            value={(
              <>
                2.1 <span className="Vlt-black">(1.1 - 2.9)</span>
              </>
            )}
          />

          <QualityItem
            label="Avg Bitrate"
            value="1.2Mbps"
          />

          <QualityItem
            label="Avg Latency"
            value="80ms"
          />
        </Grid>
      </Grid>
      <Box m={2} />
      <h3 className={mStyles.noMargin}>
        Quick Quality View
      </h3>
      <p>
        Publisher (075c9b47-dcc2-419d-9396-ff3b5ea8dfc7) seems to be experiencing <strong>very low bitrate</strong> (avg 0.02 Mbps). It is using <strong>JS SDK V2.18.1 on Chrome.</strong>
      </p>
    </Box>
  )
}

export default QuickQualityView;
