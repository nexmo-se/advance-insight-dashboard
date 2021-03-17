import useStyles from "./styles";
import { useQuality } from "./hooks/quality";

import QualityItem from "../QualityItem";
import { Box, Grid } from "@material-ui/core";

function QuickQualityView () {
  const mStyles = useStyles();
  const { quality } = useQuality();

  if (!quality) return null;
  else {
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
                  {quality.video.mos?.avg.toFixed(2)}<span className="Vlt-black"> &nbsp;
                  ({quality.video.mos?.min.toFixed(2)}-{quality.video.mos?.max.toFixed(2)})</span>
                </>
              )}
            />

            <QualityItem
              label="Avg Bitrate"
              value={`${(quality.video.bitrate.avg).toFixed(2)}Kbps`}
            />

            <QualityItem
              label="Avg Latency"
              value={`${quality.video.latency.avg.toFixed(2)}ms`}
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
                  {quality.audio.mos?.avg.toFixed(2)}<span className="Vlt-black"> &nbsp;
                  ({quality.audio.mos?.min.toFixed(2)}-{quality.audio.mos?.max.toFixed(2)})</span>
                </>
              )}
            />

            <QualityItem
              label="Avg Bitrate"
              value={`${(quality.audio.bitrate.avg).toFixed(2)}Kbps`}
            />

            <QualityItem
              label="Avg Latency"
              value={`${quality.audio.latency.avg.toFixed(2)}ms`}
            />
          </Grid>
        </Grid>
        {/* <Box m={2} />
        <h3 className={mStyles.noMargin}>
          Quick Quality View
        </h3>
        <p>
          Publisher (075c9b47-dcc2-419d-9396-ff3b5ea8dfc7) seems to be experiencing <strong>very low bitrate</strong> (avg 0.02 Mbps). It is using <strong>JS SDK V2.18.1 on Chrome.</strong>
        </p> */}
      </Box>
    )
  }
}

export default QuickQualityView;
