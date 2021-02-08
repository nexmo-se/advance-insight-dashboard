import { useState } from "react";

import Page from "components/Page";
import SearchAndFilter from "components/SearchAndFilter";

import { Grid } from "@material-ui/core";
import Card from "components/Card";

function MainPage() {
  const [container, setContainer] = useState<any>(null);

  return (
    <Page>
      <SearchAndFilter container={container}>
        {/** Put any component based on the seach and filter */}
      </SearchAndFilter>

      <Grid
        spacing={2}
        ref={setContainer}
        container
      >
        {/** In real, the component above will be rendered here. */}
      </Grid>
    </Page>
  )
}

export default MainPage;
