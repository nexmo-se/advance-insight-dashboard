import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";

import clsx from "clsx";

import useStyles from "./styles";
import { useSessionData } from "./hooks/session-data";
import { useSession } from "components/SessionProvider";
import { useSearch } from "components/SearchAndFilter";

import SessionItem from "./components/SessionItem";
import Card from "components/Card";
import { Box } from "@material-ui/core";

function SessionList() {
  const { apiKey } = useSession();
  const { startTime, endTime } = useSearch();
  const { loading, error, sessions } = useSessionData({
    apiKey,
    startTime,
    endTime
  });
  const mStyles = useStyles();

  // TODO: `fetchMore` is still not working. I have no idea why everytime it fetch more, it fetches the original item again.
  // function handleLoadMoreClick (e: MouseEvent<HTMLDivElement>) {
  //   if (endCursor) {
  //     fetchMore({
  //       variables: {
  //         endCursor
  //       }
  //     });
  //   }
  // }

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
                </tr>
              </thead>
              <tbody>
                {
                  sessions.map((sessionData) => (
                    <SessionItem
                      key={sessionData.id}
                      sessionData={sessionData}
                    />
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
            textAlign="right"
          >
            <p>Powered by Advanced Insights</p>
          </Box>
        </Card.Footer>
      </Card>
    )
  }
}

export default SessionList;
