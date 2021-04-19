import clsx from "clsx";

import useStyles from "./styles";
import { useSessionData } from "../../hooks/session-data";

import Spinner from "components/Spinner";
import SessionItem from "../SessionItem";
import { Box } from "@material-ui/core";

function SessionListTable () {
  const mStyles = useStyles();
  const { loading, error, sessions } = useSessionData();

  if (loading) return <Spinner />
  return (
    <Box
      className={
        clsx(
          "Vlt-table Vlt-table--short",
          mStyles.tableFixHead
        )
      }
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
  )
}

export default SessionListTable;
