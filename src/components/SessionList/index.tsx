import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";
import useStyles from "./styles";

import SessionListTable from "./components/SessionListTable";
import Card from "components/Card";
import { Box } from "@material-ui/core";

function SessionList() {
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

  return (
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
  // }
}

export default SessionList;
