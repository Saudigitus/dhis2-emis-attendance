import { type AttendanceOptionsProps } from "../../../types/variables/AttributeColumns";
import React from "react";
import { AccessTime, HighlightOff, CheckCircleOutline, ExitToApp, RemoveCircleOutline, NotInterestedOutlined } from "@material-ui/icons";
import { Chip, Tooltip } from "@mui/material";
import { useAttendanceConst } from "../../constants/attendance/attendanceConst";
import style from "../../../components/table/render/attendance.module.css";

export const getIcon = (option: AttendanceOptionsProps, disabled = false, isOwnershipOu = true) => {
    const { attendanceConst } = useAttendanceConst()
    const styles = { color: 'rgba(0, 0, 0, 0.3)' }

    const codeComponent = {
        [attendanceConst("present") as string]: <CheckCircleOutline style={!isOwnershipOu ? {color: "#21B26D66"} : disabled ? styles : { color: "#21B26D" }} />,
        [attendanceConst("late") as string]: <AccessTime style={!isOwnershipOu ? {color: "#EAB63166"} : disabled ? styles : { color: "#EAB631" }} />,
        [attendanceConst("absent") as string]: <HighlightOff style={!isOwnershipOu ? {color: "#F05C5C66"} : disabled ? styles : { color: "#F05C5C" }} />,
        Empty: <RemoveCircleOutline style={{ color: "#ADAEB0" }} />,
        Absense: <Chip
            label={option.key.substring(0, 1) + option.key.substring(1, option.key.length).toLowerCase()}
            size='small' className={style.reasonOfAbsense}
        />,
        NonSchoolDay: <NotInterestedOutlined style={{ color: "#da344d2e" }} />
    }

    return <>
        {
            <Tooltip title={option.key}
                componentsProps={{
                    tooltip: {
                        sx: { textTransform: 'capitalize' }
                    }
                }}
                disableHoverListener={option.code === 'Absense'}
            >
                {codeComponent?.[option.code] ?? <ExitToApp style={!isOwnershipOu ? {color: "#28AFEA66"} : disabled ? styles : { color: "#28AFEA" }} />}
            </Tooltip>}
    </>
}
