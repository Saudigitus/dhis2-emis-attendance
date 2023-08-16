import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponse, getAttendanceDays } from "../../utils/table/header/formatResponse";
import { type CustomAttributeProps } from "../../types/table/AttributeColumns";

export function useHeader() {
    const programConfigState = useRecoilValue(ProgramConfigState);
    const [columnHeader, setcolumnHeader] = useState<CustomAttributeProps[]>([])
    const [selectedDate, setselectedDate] = useState(new Date())
    const [controlRender, setcontrolRender] = useState(true)

    useEffect(() => {
        if (typeof formatResponse(programConfigState) !== "undefined" && controlRender) {
            setcolumnHeader(formatResponse(programConfigState).concat(getAttendanceDays(selectedDate)) ?? [])
            setcontrolRender(false)
        }
    }, [formatResponse(programConfigState), selectedDate])

    return {
        columns: columnHeader,
        columnHeader,
        setcolumnHeader
    }
}
