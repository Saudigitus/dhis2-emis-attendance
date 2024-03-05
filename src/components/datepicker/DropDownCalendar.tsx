
import React, { useState } from 'react'
import Calendar from './Calendar';
import { format } from 'date-fns';
import style from './datepicker.module.css'
import { Popover, Typography, Paper, Button } from '@material-ui/core';
import { DropDownCalendarProps } from '../../types/datePicker/CalendarTypes';

export default function DropDownCalendar(props: DropDownCalendarProps) {
    const { anchorEl, close, open, setValue, setAttendanceMode, localAttendanceMode } = props
    const [localDateSelected, setlocalDateSelected] = useState<{ selectedDate: Date }>({ selectedDate: new Date() })

    return (
        <Popover open={open} anchorEl={anchorEl} placement={"bottom"}>
            <Paper>
                <div className={style.datepickerTypography}>
                    <Typography variant="overline">SELECT DATE</Typography>
                    <Typography variant="h4" className="mt-2">{format(new Date(localDateSelected.selectedDate), "E, MMM dd - YYY")}</Typography>
                </div>
                <Calendar setValue={setlocalDateSelected} value={localDateSelected} />
                <div className={style.datepickerButtons}>
                    <Button onClick={() => { close() }} color="primary" className="mb-2">CANCEL</Button>
                    <Button onClick={() => { setValue(localDateSelected); close(); setAttendanceMode(localAttendanceMode) }} color="primary" className="mb-2">OK</Button>
                </div>
            </Paper>
        </Popover>
    )
}
