import Papa from "papaparse";
import SessionData from "../../models/session-data";
import lodash from "lodash";
import { useSessionList } from "../Provider";

function DownloadUsageData () {
  const { sessions } = useSessionList();

  /**
   * Download all data that is displyaed inside SessionListTable
   * This function will create an `a` element, and put the link for download there.
   * It will automatically start the download
   */
  function handleClick () {
    if (!sessions) return;
    if (sessions.length === 0) return;

    const data = lodash(sessions).map(
      (session) => session.toCSV()
    ).compact().value();

    const csv = Papa.unparse(data);
    const csvContent = `data:text/csv;charset=utf-8,${csv}`;
    
    const hiddenElement = document.createElement("a");
    hiddenElement.href = encodeURI(csvContent);
    hiddenElement.target = "_blank";
    hiddenElement.download = "Session List.csv";
    hiddenElement.click();
    hiddenElement.remove();
  }

  return (
    <span onClick={handleClick}>
      Download Usage Data &nbsp;
    </span>
  )
}

export default DownloadUsageData;
