import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";

import clsx from "clsx";
import { DateTime } from "luxon";
import { MouseEvent } from "react";

import useStyles from "./styles";
import { useSessionData } from "./hooks/session-data";
import { useSession } from "components/SessionProvider";
import { useSearch } from "components/SearchAndFilter";

import Card from "components/Card";
import { Box } from "@material-ui/core";

function SessionList() {
  // const [data, setData] = useState<SessionData[]>([]);
  const { apiKey } = useSession();
  const { startTime, endTime } = useSearch();
  const { loading, error, sessions, endCursor, fetchMore } = useSessionData({
    apiKey,
    startTime,
    endTime
  });
  const mStyles = useStyles();

  // TODO: `fetchMore` is still not working. I have no idea why everytime it fetch more, it fetches the original item again.
  function handleLoadMoreClick (e: MouseEvent<HTMLDivElement>) {
    if (endCursor) {
      fetchMore({
        variables: {
          endCursor
        }
      });
    }
  }

  if (loading) return <>Loading...</>
  else if (error) return <>Error...</>
  else {
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
                  <th>DESTROYED AT</th>
                  <th>CONNECTIONS</th>
                  <th>PUBLISHED MINUTES</th>
                  <th>SUBSCRIBED MINUTES</th>
                  <th>QUALITY (MOS)</th>
                </tr>
              </thead>
              <tbody>
                {
                  sessions.map((sessionData) => (
                    <tr key={sessionData.id}>
                      <td className={mStyles.tableCell}>
                        {sessionData.id}
                      </td>
                      <td className="Vlt-table__cell--nowrap">
                        {
                          sessionData.createdAt? sessionData.createdAt.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS): "-"
                        }
                      </td>
                      <td className="Vlt-table__cell--nowrap">
                        {
                          sessionData.destroyedAt? sessionData.destroyedAt.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS): "-"
                        }
                      </td>
                      <td className="Vlt-table__cell--number">
                        {sessionData.connections}
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

                {/**
                  (endCursor) && (
                    <Box
                      mt={2}
                      className={mStyles.clickableText}
                      onClick={handleLoadMoreClick}
                    >
                      <span>Load more...</span>
                    </Box>
                  )
                 */}
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
              className={mStyles.clickableText}
            >
              <span>
                Download Usage Data &nbsp;
              </span>
              <svg className="Vlt-icon Vlt-icon--small">
                <use xlinkHref={`${IconPath}#Vlt-icon-download`} />
              </svg>
            </Box>
            <p>Powered by Advanced Insights</p>
          </Box>
        </Card.Footer>
      </Card>
    )
  }
}

export default SessionList;
