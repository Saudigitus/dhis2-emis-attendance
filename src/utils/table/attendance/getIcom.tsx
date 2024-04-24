import {type AttendanceOptionsProps} from "../../../types/variables/AttributeColumns";
import React from "react";
import {AccessTime, HighlightOff, CheckCircleOutline, ExitToApp, RemoveCircleOutline} from "@material-ui/icons";
import {Tooltip} from "@mui/material";
import {useAttendanceConst} from "../../constants/attendance/attendanceConst";

export const getIcon = (option: AttendanceOptionsProps, disabled = false) => {
    const {attendanceConst} = useAttendanceConst()
    const styles = {color: 'rgba(0, 0, 0, 0.3)'}

    const codeComponent = {
        [attendanceConst("present") as string]: <CheckCircleOutline style={disabled ? styles : {color: "#21B26D"}}/>,
        [attendanceConst("late") as string]: <AccessTime style={disabled ? styles : {color: "#EAB631"}}/>,
        [attendanceConst("absent") as string]: <HighlightOff style={disabled ? styles : {color: "#F05C5C"}}/>,
        Empty: <RemoveCircleOutline style={{color: "#ADAEB0"}}/>
    }

    return <>
        {
            <Tooltip title={option.key}>
                {FindIcon()}
            </Tooltip>}
    </>
}
