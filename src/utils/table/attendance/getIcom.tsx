import {type AttendanceOptionsProps} from "../../../types/variables/AttributeColumns";
import React from "react";
import {AccessTime, HighlightOff, CheckCircleOutline, ExitToApp} from "@material-ui/icons";
import {Tooltip} from "@mui/material";
import {useAttendanceConst} from "../../constants/attendance/attendanceConst";

export const getIcon = (option: AttendanceOptionsProps, disabled = false) => {
    const {attendanceConst} = useAttendanceConst()
    const styles = {color: '#000', opacity: 0.4 }

    const FindIcon = (): any => {
        const codeComponent = {
            [attendanceConst("present") as string]: <CheckCircleOutline style={disabled ? styles : {color: "#21B26D"}}/>,
            [attendanceConst("late") as string]: <AccessTime style={disabled ? styles : {color: "#EAB631"}}/>,
            [attendanceConst("absent") as string]: <HighlightOff style={disabled ? styles : {color: "#F05C5C"}}/>
        }

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        return codeComponent?.[option.code] ?? <ExitToApp style={disabled ? styles : {color: "#28AFEA"}}/>
    }

    console.log(option.code, attendanceConst("late"))
    return <>
        {
            <Tooltip title={option.key}>
                {FindIcon()}
            </Tooltip>}
    </>
}
