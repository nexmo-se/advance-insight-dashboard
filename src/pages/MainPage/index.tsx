import { useState } from "react";

import Page from "components/Page";
import SearchAndFilter from "components/SearchAndFilter";

import { Grid } from "@material-ui/core";
import Card from "components/Card";
import {useAppApolloClient} from '../../auth/apolloAuth';
import { ApolloProvider } from "@apollo/client";
import SessionSummary from "components/SessionSummary";
import SessionList from "components/SessionList";
import SessionDeepDive from "components/SessionDeepDive"

function MainPage() {
  const [container, setContainer] = useState<any>(null);
  const apolloClient = useAppApolloClient();

  return (
    <Page>
        <ApolloProvider client={apolloClient}>
      <SearchAndFilter container={container}>
        {/** Put any component based on the seach and filter */}
        <Grid spacing={2} container item>
          <Grid xs={6} item></Grid>
          <Grid xs={6} item>
            <SessionList />
          </Grid>
        </Grid>
        <Grid spacing={2} container item>
          <Grid xs={12} item>
            <SessionSummary />
          </Grid>
        </Grid>
        <Grid spacing={2} container item>
          <Grid xs={12} item>
            <SessionDeepDive></SessionDeepDive>
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
      </ApolloProvider>
    </Page>
  )
}

export default MainPage;
