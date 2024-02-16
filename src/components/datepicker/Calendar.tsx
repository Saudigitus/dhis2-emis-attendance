import * as React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers';
import { unavailableSchoolDays } from '../../utils/constants/attendance/unavailableSchoolDays';

interface CalendarProps {
  value: { selectedDate: Date }
  setValue: ({ selectedDate }: { selectedDate: Date }) => void
}

export default function Calendar(props: CalendarProps) {
  const { value, setValue } = props
  const { unavailableDays } = unavailableSchoolDays()

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateCalendar
        value={value.selectedDate}
        onChange={(e) => { setValue({ selectedDate: e as Date }) }}
        shouldDisableDate={(date) => unavailableDays(date)}
      />
    </LocalizationProvider>
  );
}
