import { useQuery, gql } from "@apollo/client";
import { get } from "lodash";
import ReactApexChart from "react-apexcharts";
import { DateTime, Duration, Interval } from "luxon";

const GET_USAGE_TIMELINE_DATA = gql`
  query getUsageTimeline(
    $projectId: Int!
    $sessionId: [String]!
    $startTime: Date!
    $endTime: Date!
    $meetingId: String!
  ) {
    project(projectId: $projectId) {
      sessionData {
        sessions(sessionIds: $sessionId) {
          resources {
            meetings(start: $startTime, end: $endTime, meetingId: $meetingId) {
              totalCount
              resources {
                createdAt
                destroyedAt
                meetingId
                connections {
                  resources {
                    createdAt
                    destroyedAt
                    connectionId
                    guid
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

function roundConnectionTime(startDate: number, endDate: number): number {
  if (!startDate || !endDate) {
    return 0;
  }
  const computedMinutes = Math.round((endDate - startDate) / 1000 / 60);
  return computedMinutes ? computedMinutes : 0;
}

interface UsageTimelineInterface {
  apiKey: string;
  sessionIds: string[];
  startTime: DateTime;
  endTime: DateTime;
  meetingId?: String;
}

function UsageTimeline({
  apiKey,
  sessionIds,
  startTime,
  endTime,
  meetingId
}: 
UsageTimelineInterface) {
  const { loading, data } = useQuery(GET_USAGE_TIMELINE_DATA, {
    variables: {
      projectId: apiKey,
      sessionId: sessionIds,
      startTime,
      endTime,
      meetingId,
    },
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  const resources = get(data, "project.sessionData.sessions.resources", []);
  if (resources && resources.length && resources[0].meetings) {
    let meetings = get(resources[0], "meetings.resources", []);
    console.log("[UsageTimeline] - Meetings", meetings)
    let publisherSeries: any = []; /*  {name: 'Joe',
                                    data: [{
                                    x: 'Design',
                                    y: [new Date('2019-03-01').getTime(), new Date('2019-03-02').getTime()] 
                                    } */
    for (let i = 0; i < meetings.length; i += 1) {
      // {createtAt, destroyed}
      const currentPublishers = get(meetings[i], "connections.resources", []);
      // todo this is not doable. We need to filter by meetings
      for (let j = 0; j < currentPublishers.length; j += 1) {
        const connectionDuration = roundConnectionTime(
          new Date(currentPublishers[j].createdAt).getTime(),
          new Date(currentPublishers[j].destroyedAt).getTime()
        );
        if (connectionDuration) {
          const findPublisherIdx = publisherSeries.findIndex(
            (el: any) => el && el.name === currentPublishers[j].guid
          );
          if (findPublisherIdx !== -1) {
            // if element exists, just push another data.
            publisherSeries[findPublisherIdx].data.push({
              x: currentPublishers[j].guid,
              y: [
                new Date(currentPublishers[j].createdAt).getTime(),
                new Date(currentPublishers[j].destroyedAt).getTime(),
              ],
            });
          } else {
            // push element on the array
            publisherSeries.push({
              name: currentPublishers[j].guid,
              data: [
                {
                  x: currentPublishers[j].guid,
                  y: [
                    new Date(currentPublishers[j].createdAt).getTime(),
                    new Date(currentPublishers[j].destroyedAt).getTime(),
                  ],
                },
              ],
            });
          }
        }
      }
    }

    /* console.log("publisherSeries", publisherSeries); // {name: connectionId, data: [{x: }]}
    console.log("startDate", meetings[0].createdAt);
    console.log("endDate", meetings[meetings.length - 1].destroyedAt); */
    const chartOptions = {
      options: {
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        dataLabels:{
          enabled: true,
          formatter: function(val: any) {
            /* var interval =  Interval.fromDateTimes(DateTime.fromMillis(val[0]), DateTime.fromMillis(val[1]));
            console.log("dataLabel", Math.round(interval.toDuration(['minutes']).as('minutes')));
            return Math.round(interval.toDuration(['minutes']).as('minutes')) + 'Minutes'; */
          }
        },
        colors: ['#80c7f5', '#871fff', '#fa7454', '#d6219c', '#616266', '#335062','#3298c4'],
        yaxis: {
          min: new Date(meetings[0].createdAt).getTime(),
          max: new Date(meetings[meetings.length - 1].destroyedAt).getTime(),
        },
        xaxis: {
          type: "datetime",
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100],
          },
        },
      },
      series: publisherSeries,
    };
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
