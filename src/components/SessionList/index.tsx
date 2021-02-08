import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";

import clsx from "clsx";
import useStyles from "./styles";
import { DateTime } from "luxon";

import Card from "components/Card";
import { Box } from "@material-ui/core";

const sessionData = {
  id: "2_MX40Njc4OTM2NH5-MTYxMDk0ODI4NDIzNX5wYlBvMlh2TGlCMW5UYUVwSm5adll0bHB-fg",
  createdAt: DateTime.local(),
  connections: 42,
  maxPublishers: 5,
  publishedMinutes: 329,
  subscribedMinutes: 329,
  quality: 4.2
};

const data = [sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData, sessionData];

function SessionList() {
  const mStyles = useStyles();

  return (
    <Card>
      <Card.Header>
        <p>
          <b>Session List</b>
        </p>
      </Card.Header>
      <Card.Content>
        <Box
          className={clsx(
            "Vlt-table Vlt-table--short",
            mStyles.tableFixHead
          )}
        >
          <table>
            <thead>
              <tr>
                <th>SESSION ID</th>
                <th>CREATED AT</th>
                <th>CONNECTIONS</th>
                <th>MAX CON PUBLISHERS</th>
                <th>PUBLISHED MINUTES</th>
                <th>SUBSCRIBED MINUTES</th>
                <th>QUALITY (MOS)</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((sessionData) => (
                  <tr>
                    <td className={mStyles.tableCell}>
                      {sessionData.id}
                    </td>
                    <td className="Vlt-table__cell--nowrap">
                      {sessionData.createdAt.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
                    </td>
                    <td className="Vlt-table__cell--number">
                      {sessionData.connections}
                    </td>
                    <td className="Vlt-table__cell--number">
                      {sessionData.maxPublishers}
                    </td>
                    <td className="Vlt-table__cell--number">
                      {sessionData.publishedMinutes}
                    </td>
                    <td className="Vlt-table__cell--number">
                      {sessionData.subscribedMinutes}
                    </td>
                    <td className="Vlt-table__cell--number">
                      {sessionData.quality}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </Box>
      </Card.Content>
      <Card.Footer noborder>
        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <span className="Vlt-purple">
              Download Usage Data &nbsp;
            </span>
            <svg className="Vlt-icon Vlt-icon--small Vlt-purple">
              <use xlinkHref={`${IconPath}#Vlt-icon-download`} />
            </svg>
          </Box>
          <p>Powered by Advanced Insights</p>
        </Box>
      </Card.Footer>
    </Card>
  )
}

export default SessionList;
