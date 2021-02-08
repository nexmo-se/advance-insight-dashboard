import React from 'react';
import { gql } from '@apollo/client';
import moment from 'moment'

const query = gql`
  {
    project(projectId: ${apiKey}) {
      projectData(
        start: ${moment().subtract(10, 'days')},
        groupBy: COUNTRY,
        country: [AR, BR, ES, FR, MX, US]
      ) {
        resources {
          country,
          quality {
            subscriber {
              videoBitrateKbpsAvg
            }
          }
        }
      }
    }
  }
`;

function SessionSummary({sessionId}){
    // this function should only display one sessionId at a time.
    // query for tot pubs and sub minutes 

}

export default SessionSummary