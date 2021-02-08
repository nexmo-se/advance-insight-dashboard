import { useState } from "react";

import Page from "components/Page";
import SearchAndFilter from "components/SearchAndFilter";

import { Grid } from "@material-ui/core";
import SessionList from "components/SessionList";

function MainPage() {
  const [container, setContainer] = useState<any>(null);

  return (
    <Page>
      <SearchAndFilter container={container}>
        {/** Put any component based on the seach and filter */}
        <Grid spacing={2} container item>
          <Grid xs={6} item></Grid>
          <Grid xs={6} item>
            <SessionList />
          </Grid>
        </Grid>
      </SearchAndFilter>

      <Grid
        spacing={2}
        ref={setContainer}
        container
      >
        {/**
         * In real, the component above will be rendered here.
         * So, do not put any component here.
         * */}
      </Grid>
    </Page>
  )
}

export default MainPage;
