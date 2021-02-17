function SessionSummary() {
  return null;
}

export default SessionSummary;

// import React from 'react';
// import { useQuery, gql } from '@apollo/client';
// import moment from 'moment'

// const getSessionSummaryData = (projectId, sessionId) => gql`
// {
//     project(projectId: ${46843184}) {
//       sessionData {
//         sessions(sessionIds: [${sessionId}]){
//           resources{
//             publisherMinutes,
//             subscriberMinutes,
//             meetings{
//               totalCount,
//               resources{
//                 createdAt,
//                 publishers {
//                   totalCount
//                 },
//                 subscribers {
//                   totalCount
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// function SessionSummary({sessionId}){
//     // this function should only display one sessionId at a time.
//     // query for tot pubs and sub minutes 

// }

// export default SessionSummary