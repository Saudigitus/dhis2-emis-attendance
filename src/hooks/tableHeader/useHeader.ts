import { useRecoilState, useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponse, getAttendanceDays } from "../../utils/table/header/formatResponse";
import { TableColumnState } from "../../schema/tableColumnsSchema";
import { SelectedDateState } from "../../schema/attendanceSchema";
import { useAttendanceMode } from "../attendanceMode/useAttendanceMode";
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";

export function useHeader() {
    const programConfigState = useRecoilValue(ProgramConfigState);
    const { selectedDate } = useRecoilValue(SelectedDateState)
    const [columnHeader, setcolumnHeader] = useRecoilState(TableColumnState)
    const [controlRender, setcontrolRender] = useState(true)
    const { attendanceMode } = useAttendanceMode()
    const { getDataStoreData } = getSelectedKey()
    const registrationProgramStage = getDataStoreData.registration.programStage
    const attendanceProgramStage = getDataStoreData.attendance.programStage

    useEffect(() => {
        if (typeof formatResponse({ data: programConfigState, programStageId: registrationProgramStage }) !== "undefined" && controlRender) {
            setcolumnHeader(formatResponse({ data: programConfigState, programStageId: registrationProgramStage }).concat(getAttendanceDays(selectedDate, attendanceMode, programConfigState, attendanceProgramStage)) ?? [])
            setcontrolRender(false)
        }
    }, [formatResponse({ data: programConfigState, programStageId: registrationProgramStage }), controlRender])

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
