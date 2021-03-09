import "react-datepicker/dist/react-datepicker.css";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";

import { MouseEvent } from "react";
import { SaveClickEvent } from "components/SearchAndFilter/types";

import DatePickerInput from "../DatePickerInput";
import Card from "components/Card";
import Button from "components/Button";
import DatePicker from "react-datepicker";
import { Box } from "@material-ui/core";

interface ISearchCard {
  onSaveClick: (args: SaveClickEvent) => void;
}

function SearchCard({ onSaveClick }: ISearchCard) {
  const [saving, setSaving] = useState<boolean>(false);
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<DateTime>(DateTime.local().minus({ day: 7 }));
  const [endTime, setEndTime] = useState<DateTime>(DateTime.local());

  function handleSessionIdsChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const values = e.target.value.split(",");
    setSessionIds(values);
  }

  function handleStartTimeChange(startTime: Date) {
    setStartTime(DateTime.fromJSDate(startTime));
  }

  function handleEndTimeChange(endTime: Date) {
    setEndTime(DateTime.fromJSDate(endTime));
  }

  async function handleSaveClick(e: MouseEvent<HTMLButtonElement>) {
    setSaving(true);
    if (onSaveClick) onSaveClick({ sessionIds, startTime, endTime });

    // this just to provide animation that is is saving
    // by doing this, user will have a feeling that something is happening in the background
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    })
    setSaving(false);
  }

  useEffect(
    () => {
      setStartTime(DateTime.local().minus({ day: 7 }));
      setEndTime(DateTime.local());
    },
    [setStartTime, setEndTime]
  )

  return (
    <Card>
      <Card.Header>
        <p>
          <b>SEARCH AND FILTERS</b>
        </p>
      </Card.Header>
      <Card.Content>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="flex-end"
        >
          <Box
            flex={1}
            marginRight={2}
          >
            <p>Search By Session Id(s)</p>
            <Box className="Vlt-textarea">
              <textarea
                rows={2}
                value={sessionIds?.join(",")}
                onChange={handleSessionIdsChange}
                placeholder="Session Id(s) (Optional)"
              />
            </Box>
          </Box>
          <Box mr={2}>
            <p>Search By Time Range</p>
            <Box id="date-picker-portal" />
            <Box>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={startTime.toJSDate()}
                onChange={handleStartTimeChange}
                customInput={<DatePickerInput />}
                startDate={startTime.toJSDate()}
                endDate={endTime.toJSDate()}
                portalId="date-picker-portal"
                selectsStart
                closeOnScroll
              />
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={endTime.toJSDate()}
                onChange={handleEndTimeChange}
                customInput={<DatePickerInput marginLeft/>}
                startDate={startTime.toJSDate()}
                endDate={endTime.toJSDate()}
                minDate={startTime.toJSDate()}
                portalId="date-picker-portal"
                selectsEnd
                closeOnScroll
              />
            </Box>
          </Box>
          <Button.Secondary
            onClick={handleSaveClick}
            disabled={saving}
            app
          >
            Search
          </Button.Secondary>
        </Box>
      </Card.Content>
    </Card>
  )
}

export default SearchCard;
