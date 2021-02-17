import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";

import clsx from "clsx";
import lodash from "lodash";
import SessionData from "./models/session-data";
import SessionService from "./services/session";
import { DateTime } from "luxon";

import useStyles from "./styles";
import { useSession } from "components/SessionProvider";
import { useSearch } from "components/SearchAndFilter";
import { useState, useEffect } from "react";

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

function SessionList() {
  const [data, setData] = useState<SessionData[]>([]);
  const { apiKey, generateJwt } = useSession();
  const { startTime, endTime } = useSearch();
  const mStyles = useStyles();

  useEffect(() => {
    async function fetchData() {
      if (!generateJwt) return;
      
      const jwt = generateJwt();
      if (!jwt) return;
      if (!apiKey) return;

      const sessionIds = await SessionService.listSessionIds({
        apiKey,
        jwt: jwt.project,
        startTime,
        endTime
      });

      const promises = sessionIds.map(async (sessionId) => {
        const jwt = generateJwt();
        if (!jwt) return undefined;

        return SessionService.retrieveDetail({
          id: sessionId,
          jwt: jwt.project,
          apiKey,
        });
      });

      const data = await Promise.all(promises);
      const compactData = lodash.compact(data);
      const sortedData = lodash.sortBy(compactData, (data) => data.createdAt.toMillis());

      setData(sortedData);
    }

    fetchData();
  }, [apiKey, generateJwt])


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
                  <tr key={sessionData.id}>
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
