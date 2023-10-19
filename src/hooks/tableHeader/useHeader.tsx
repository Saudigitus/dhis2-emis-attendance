import { useRecoilState, useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponse, getAttendanceDays } from "../../utils/table/header/formatResponse";
import { TableColumnState } from "../../schema/tableColumnsSchema";
import { SelectedDateState } from "../../schema/attendanceSchema";
import { useAttendanceMode } from "../attendanceMode/useAttendanceMode";

export function useHeader() {
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { selectedDate } = useRecoilValue(SelectedDateState)
    const [columnHeader, setcolumnHeader] = useRecoilState(TableColumnState)
    const [controlRender, setcontrolRender] = useState(true)
    const { attendanceMode } = useAttendanceMode()

    useEffect(() => {
        if (typeof formatResponse(programConfigState) !== "undefined" && controlRender) {
            setcolumnHeader(formatResponse(programConfigState).concat(getAttendanceDays(selectedDate, attendanceMode, programConfigState)) ?? [])
            setcontrolRender(false)
        }
    }, [formatResponse(programConfigState), controlRender])

    useEffect(() => {
        if (!controlRender) {
            setcontrolRender(true)
        }
    }, [selectedDate, attendanceMode])

    return {
        columns: columnHeader,
        columnHeader,
        setcolumnHeader
    }
}
