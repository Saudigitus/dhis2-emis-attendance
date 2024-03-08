import * as React from 'react';
import { DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CalendarProps } from '../../types/datePicker/CalendarTypes';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { unavailableSchoolDays } from '../../utils/constants/attendance/unavailableSchoolDays';


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
