import { useState } from "react";

import Page from "components/Page";
import SearchAndFilter from "components/SearchAndFilter";

import { Grid } from "@material-ui/core";
import Card from "components/Card";
import {useAppApolloClient} from '../../auth/apolloAuth';
import { ApolloProvider } from "@apollo/client";
import SessionSummary from '../../components/SessionSummary'

function MainPage() {
  const [container, setContainer] = useState<any>(null);
  const apolloClient = useAppApolloClient();

  return (
    <Page>
        <ApolloProvider client={apolloClient}>
      <SearchAndFilter container={container}>
        {/** Put any component based on the seach and filter */}
        <SessionSummary ></SessionSummary>
      </SearchAndFilter>

      <Grid
        spacing={2}
        ref={setContainer}
        container
      >
        {/** In real, the component above will be rendered here. */}
      </Grid>
      </ApolloProvider>
    </Page>
  )
}

export default MainPage;
