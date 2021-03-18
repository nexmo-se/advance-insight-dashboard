import { useQuery, gql } from "@apollo/client";
import { get } from "lodash";
import ReactApexChart from "react-apexcharts";
import { DateTime } from "luxon";

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

function queryError() {
    return (
        <div className="Vlt-callout Vlt-callout--critical">
        <i></i>
        <div className="Vlt-callout__content">
            <p>There was a problem with retrieving the data, please try again.</p>
        </div>
        </div>
    )
}

function roundConnectionTime(startDate: number, endDate: number): number {
  if (!startDate || !endDate) {
    return 0;
  }
  const computedMinutes = Math.round((endDate - startDate) / 1000 / 60);
  return computedMinutes ? computedMinutes : 1; // If connection time is less than one minute, I round up to 1 minute
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
  const { loading, data, error } = useQuery(GET_USAGE_TIMELINE_DATA, {
    variables: {
      projectId: apiKey,
      sessionId: sessionIds,
      startTime,
      endTime,
      meetingId,
    },
  });

  if (loading) {
    return (<div>
        <div className="Vlt-spinner"></div>
        <p>Loading ...</p>
        </div>);
  }
  if (error) {
    return queryError();
  } 
  const resources = get(data, "project.sessionData.sessions.resources", []);
  if (resources && resources.length && resources[0].meetings) {
    let meetings = get(resources[0], "meetings.resources", []);
    if (!meetings.length) {
        return <p>There are no available meetings for this session</p>;
    }
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
        const pubGuid = currentPublishers[j].guid ? currentPublishers[j].guid : `Anonymous-${Math.random().toString(36).substring(7)}`
        if (connectionDuration) {
          const findPublisherIdx = publisherSeries.findIndex(
            (el: any) => el && el.name === pubGuid
          );
          if (findPublisherIdx !== -1) {
            // if element exists, just push another data.
            publisherSeries[findPublisherIdx].data.push({
              x: pubGuid,
              y: [
                new Date(currentPublishers[j].createdAt).getTime(),
                new Date(currentPublishers[j].destroyedAt).getTime(),
              ],
            });
          } else {
            // push element on the array
            publisherSeries.push({
              name: pubGuid,
              data: [
                {
                  x: pubGuid,
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
        tooltip: {
            y: {
                formatter: function(value: any, { series, seriesIndex, dataPointIndex, w }: any) {
                  return 'ConnectionTime:';
                }
            },
            x: {
                formatter: function(value: any, series: any) {
                  if (isNaN(value)) {
                    return '';
                  }
                  return DateTime.fromMillis(value).toLocaleString(DateTime.TIME_SIMPLE)
                }
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
