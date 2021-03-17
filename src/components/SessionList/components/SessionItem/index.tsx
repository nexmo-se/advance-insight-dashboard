import SessionData from "../../models/session-data";
import clsx from "clsx";
import { DateTime } from "luxon";

import useStyles from "./styles";
import { useSearch } from "components/SearchAndFilter";
import { useEffect, useState } from "react";

interface SessionItemProps {
  sessionData: SessionData;
}

function SessionItem ({ sessionData }: SessionItemProps) {
  const [selected, setSelected] = useState<boolean>(false);
  const { sessionIds, setSessionIds } = useSearch();
  const mStyles = useStyles();

  /**
   * Set the session id context inside search box.
   * This will replace existing session ids because only one session can be selected
   */
  function handleClick () {
    if (setSessionIds) setSessionIds([sessionData.id])
  }

  /**
   * If the SessionID is listed in the search context,
   * we then mark this as selected
   */
  useEffect(
    () => {
      if (!sessionIds || sessionIds.length === 0) return;

      const foundSession = sessionIds.find(
        (session) => {
          if (session === sessionData.id) return true;
          else return false;
        }
      );

      if (foundSession) setSelected(true);
      else setSelected(false);
    },
    [sessionIds, sessionData.id]
  )

  return (
    <tr
      onClick={handleClick}
      className={
        clsx({
          [mStyles.tableRow]: true,
          [mStyles.selectedRow]: selected
        })
      }
    >
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
    </tr>
  )
}

export default SessionItem;