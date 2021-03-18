import { DateTime } from "luxon";
import { DropdownItem } from "types/Dropdown";

import { useEffect, useState } from "react";
import { useSearch } from "components/SearchAndFilter";

import Dropdown from "components/Dropdown";

interface MeetingDropdownProps {
  meetings: any;
}

function MeetingDropdown ({ meetings }: MeetingDropdownProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<DropdownItem>({
    value: "view-all-meeting",
    label: "View All Meeting"
  });

  const { setMeetingId } = useSearch();

  useEffect(
    () => {
        console.log("useSearch", selectedMeeting)
      if (selectedMeeting.value === "view-all-meeting") {
        setMeetingId(undefined);
      } else {
        setMeetingId(selectedMeeting.value);
      }
    },
    [selectedMeeting, setMeetingId]
  )

  return (
    <Dropdown
      value={selectedMeeting}
      onChange={setSelectedMeeting}
    >
      {
        meetings.map(
          (meeting: Record<string, any>) => {
            const date = DateTime.fromISO(meeting.createdAt).toLocaleString(DateTime.DATE_MED);
            const startTime = DateTime.fromISO(meeting.createdAt).toLocaleString(DateTime.TIME_24_SIMPLE);
            const endTime = DateTime.fromISO(meeting.destroyedAt).toLocaleString(DateTime.TIME_24_SIMPLE)
            return (
              <Dropdown.Item
                key={`${meeting.meetingId}-${startTime}`}
                value={meeting.meetingId}
                label={`${date} ${startTime}-${endTime}`}
              />
            )
          }
        )
      }
      <Dropdown.Item value="view-all-meetings" label="View All Meetings" key="view-all-meetings"/>
    </Dropdown>
  )
}

export default MeetingDropdown;
