import { useQuery, gql } from "@apollo/client";
import { get } from "lodash";
import ReactApexChart from 'react-apexcharts';
import { DateTime } from "luxon";

const GET_USAGE_TIMELINE_DATA = gql`
  query getUsageTimeline($projectId: Int!, $sessionId: [String]!, $startTime: Date!, $endTime: Date!) {
    project(projectId: $projectId) {
      sessionData {
        sessions(sessionIds: $sessionId) {
          resources {
            meetings (start: $startTime, end: $endTime) {
              totalCount
              resources {
                createdAt
                destroyedAt
                connections {
                  resources {
                    createdAt
                    destroyedAt
                    connectionId
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function roundConnectionTime(startDate: number, endDate: number) : number{
    if (!startDate || !endDate) {
        return 0;
    }
    const computedMinutes = Math.round((endDate - startDate) / 1000 / 60);
    return computedMinutes ? computedMinutes : 0;
}

function UsageTimeline({
  apiKey,
  sessionIds,
  startTime,
  endTime
}: {
  apiKey: string;
  sessionIds: string[];
  startTime: DateTime;
  endTime: DateTime;
}) {
  const { loading, data } = useQuery(GET_USAGE_TIMELINE_DATA, {
    variables: { projectId: apiKey, sessionId: sessionIds, startTime, endTime },
  });

  // const classes = useStyles();
  if (loading) {
    return <p>Loading...</p>;
  }
  const resources = get(data, "project.sessionData.sessions.resources", []);
  if (resources && resources.length && resources[0].meetings) {
    let meetings = get(resources[0], "meetings.resources", []);
    console.log("meetings", meetings)
        let publisherSeries: any = []; /*  {name: 'Joe',
                                    data: [{
                                    x: 'Design',
                                    y: [new Date('2019-03-01').getTime(), new Date('2019-03-02').getTime()] 
                                    } */
    for (let i = 0; i < 1; i += 1) {
        // {createtAt, destroyed}
        const currentPublishers = get(meetings[i], "connections.resources", []);
        // todo this is not doable. We need to filter by meetings
        for (let j = 0; j < currentPublishers.length; j += 1) {
            const connectionDuraction = roundConnectionTime(new Date(currentPublishers[j].createdAt).getTime(), new Date(currentPublishers[j].destroyedAt).getTime());
            console.log("connectionDuraction", connectionDuraction );    
            if (connectionDuraction) {
                const findPublisherIdx = publisherSeries.findIndex((el: any) => (el && el.name === currentPublishers[j].connectionId))
                if (findPublisherIdx !== -1) {
                    // if element exists, just push another data.
                    publisherSeries[findPublisherIdx].data.push(
                        {x: currentPublishers[j].connectionId, y: [new Date(currentPublishers[j].createdAt).getTime(), 
                            new Date(currentPublishers[j].destroyedAt).getTime()]}
                    )
                } else {
                    // push element on the array
                    publisherSeries.push({name: currentPublishers[j].connectionId, 
                        data:[{x: currentPublishers[j].connectionId, y: [new Date(currentPublishers[j].createdAt).getTime(), 
                            new Date(currentPublishers[j].destroyedAt).getTime()]}]})
                }
            }
        } 
    }
    console.log("publisherSeries", publisherSeries) // {name: connectionId, data: [{x: }]}
    console.log("startDate", meetings[0].createdAt);
    console.log("endDate", meetings[meetings.length -1 ].destroyedAt);
    const chartOptions = {
        options: {
          plotOptions: {
              bar: {
                  horizontal: true,
              }
          },
          yaxis: {
            /* min: new Date('2021-02-24T00:00:05.000Z').getTime(), //todo try with times

            max: new Date('2021-02-24T23:12:05.000Z').getTime() */
            min: new Date(meetings[0].createdAt).getTime(),
            max: new Date(meetings[meetings.length -1 ].destroyedAt).getTime()
          },
          xaxis: {
             type: 'datetime'
          },
          fill: {
            type: 'gradient',
            gradient: {
                  shade: 'light',
                  type: "vertical",
                  shadeIntensity: 0.25,
                  gradientToColors: undefined,
                  inverseColors: true,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [50, 0, 100, 100]
              }
          }
        },
        series: publisherSeries
        /* series: [
          {
            name: 'Bob',
            data: [{
              x: 'Design',
              y: [new Date('2021-02-24T16:12:05.000Z').getTime(), new Date('2021-02-24T12:12:05.000Z').getTime()]
            }, {
              x: 'Design',
              y: [new Date('2021-02-24T09:12:05.000Z').getTime(), new Date('2021-02-24T10:12:05.000Z').getTime()]
              
            }]
          }, {
            name: 'Joe',
            data: [{
              x: 'Design',
              y: [new Date('2019-03-01').getTime(), new Date('2019-03-02').getTime()] 
            }, {
              x: 'Code',
              y: [new Date('2019-03-03').getTime(), new Date('2019-03-07').getTime()] 
            }, {
              x: 'Test',
              y: [new Date('2019-03-06').getTime(), new Date('2019-03-09').getTime()]
            }, {
              x: 'Deployment',
              y: [new Date('2019-03-10').getTime(), new Date('2019-03-11').getTime()]
            }]
          } 
        ] */
    }
    return (
      <div id="chart">
        <ReactApexChart
          options={chartOptions.options}
          series={chartOptions.series}
          type="rangeBar"
          height="350"
          width="800"
        />
      </div>
    );
  }
  return <p>There are not meetings for this session</p>;
}

export default UsageTimeline;
