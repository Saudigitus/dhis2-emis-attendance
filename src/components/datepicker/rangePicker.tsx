import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import style from './datepicker.module.css'
import React, { useState } from 'react'
import { format } from 'date-fns';
import { Popover, Paper } from '@material-ui/core';
import { DatePickerProps } from '../../types/datePicker/CalendarTypes';
import { Button, TextField } from "@mui/material";

export default function DatePicker(props: DatePickerProps) {
    const { setValue, value } = props
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<any>(null)

    return (
        <div>
            <TextField style={{ width: "100%" }} value={selected && `${format(selected.startDate, 'MMMM d, yyyy')} - ${format(selected.endDate, 'MMMM d, yyyy')}`} size="small" onClick={(event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); setOpen(true) }} />
            <Popover open={open}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'left', }}
            >
                <Paper>
                    <DateRange
                        editableDateInputs={true}
                        onChange={(item: any) => {
                            setValue([item.selection])
                        }}
                        moveRangeOnFirstSelection={false}
                        ranges={value}
                        direction="horizontal"
                        months={2}
                    />
                </Paper>
                <div className={style.datepickerButtons}>
                    <Button onClick={() => { setOpen(false) }} color="primary" className="mb-2">CANCEL</Button>
                    <Button onClick={() => { setSelected({ ...value[0] }); setOpen(false) }} color="primary" className="mb-2">OK</Button>
                </div>
            </Popover>
        </div>
    )
}