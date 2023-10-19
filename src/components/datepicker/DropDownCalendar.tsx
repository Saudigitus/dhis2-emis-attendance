
import React, { useState } from 'react'
import Calendar from './Calendar';
import { Popover, Typography, Paper, makeStyles, createStyles, Button } from '@material-ui/core';
import { format } from 'date-fns';

interface DropDownCalendarProps {
    open: boolean
    anchorEl: HTMLElement | null
    close: () => void
    setValue: ({ selectedDate }: { selectedDate: Date }) => void
    localAttendanceMode: "edit" | "view"
    setAttendanceMode: (arg: "edit" | "view") => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        typography: {
            padding: theme.spacing(2)
        },
        date: {
            padding: theme.spacing(1)
        }
    })
);

export default function DropDownCalendar(props: DropDownCalendarProps) {
    const { anchorEl, close, open, setValue, setAttendanceMode, localAttendanceMode } = props
    const classes = useStyles();
    const [localDateSelected, setlocalDateSelected] = useState<{ selectedDate: Date }>({ selectedDate: new Date() })

    return (
        <Popover open={open} anchorEl={anchorEl} placement={"bottom"}>
            <Paper>
                <div className={classes.typography}>
                    <Typography variant="overline">SELECT DATE</Typography>
                    <Typography variant="h4" className="mt-2">{format(new Date(localDateSelected.selectedDate), "E, MMM dd - YYY")}</Typography>
                </div>
                <Calendar setValue={setlocalDateSelected} value={localDateSelected} />
                <div className='d-flex justify-content-end'>
                    <Button onClick={() => { close() }} color="primary" className="mb-2">CANCEL</Button>
                    <Button onClick={() => { setValue(localDateSelected); close(); setAttendanceMode(localAttendanceMode) }} color="primary" className="mb-2">OK</Button>
                </div>
            </Paper>
        </Popover>
    )
}
