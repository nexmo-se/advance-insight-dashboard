import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";
import useStyles from "./styles";

import SessionListProvider from "./components/Provider";
import SessionListTable from "./components/SessionListTable";
import DownloadUsageData from "./components/DownloadUsageData";
import Card from "components/Card";
import { Box } from "@material-ui/core";
function SessionList() {
  const mStyles = useStyles();

  return (
    <SessionListProvider>
      <Card>
        <Card.Header>
          <p>
            <b>Session List</b>
          </p>
        </Card.Header>
        <Card.Content>
          <SessionListTable />
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
              <DownloadUsageData />
              <svg className="Vlt-icon Vlt-icon--small">
                <use xlinkHref={`${IconPath}#Vlt-icon-download`} />
              </svg>
            </Box>
            <p>Powered by Advanced Insights</p>
          </Box>
        </Card.Footer>
      </Card>
    </SessionListProvider>
  );
}

export default SessionList;
