import { Attribute } from "../../../types/generated/models";
import { type ProgramConfig } from "../../../types/programConfig/ProgramConfig";
import { type HeaderFormatResponseProps } from "../../../types/utils/table/TableTypes";
import { VariablesTypes, type CustomAttributeProps } from "../../../types/variables/AttributeColumns";

export function formatResponse({ data, programStageId }: HeaderFormatResponseProps): CustomAttributeProps[] {
    const originalData = ((data?.programStages?.find(programStge => programStge.id === programStageId)) ?? [] as unknown as ProgramConfig["programStages"][0])

    return data?.programTrackedEntityAttributes?.map((item) => {
        return {
            id: item.trackedEntityAttribute.id,
            displayName: item.trackedEntityAttribute.displayName,
            header: item.trackedEntityAttribute.displayName,
            required: item.mandatory,
            name: item.trackedEntityAttribute.displayName,
            labelName: item.trackedEntityAttribute.displayName,
            valueType: item.trackedEntityAttribute.optionSet?.options?.length > 0 ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : item.trackedEntityAttribute.valueType as unknown as CustomAttributeProps["valueType"],
            options: { optionSet: item.trackedEntityAttribute.optionSet },
            initialOptions: { optionSet: item.trackedEntityAttribute.optionSet },
            visible: item.displayInList,
            disabled: false,
            pattern: '',
            searchable: false,
            error: false,
            content: '',
            key: item.trackedEntityAttribute.id,
            type: VariablesTypes.Attribute
        }
    })
        .concat(
            Object.keys(originalData)?.length > 0
                ? originalData?.programStageDataElements?.map((programStageDataElement) => {
                    return {
                        id: programStageDataElement.dataElement.id,
                        displayName: programStageDataElement.dataElement.displayName,
                        header: programStageDataElement.dataElement.displayName,
                        required: programStageDataElement.compulsory,
                        name: programStageDataElement.dataElement.displayName,
                        labelName: programStageDataElement.dataElement.displayName,
                        valueType: programStageDataElement.dataElement.optionSet?.options?.length > 0 ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : programStageDataElement.dataElement.valueType as unknown as CustomAttributeProps["valueType"],
                        options: { optionSet: programStageDataElement.dataElement.optionSet },
                        initialOptions: { optionSet: programStageDataElement.dataElement.optionSet },
                        visible: programStageDataElement.displayInReports,
                        disabled: false,
                        pattern: '',
                        searchable: false,
                        error: false,
                        content: '',
                        key: programStageDataElement.dataElement.id,
                        type: VariablesTypes.DataElement
                    }
                }) as []
                : []
        )
}

export function getAttendanceDays(validDays: [{ schoolDay: boolean, date: string }], attendanceMode: "edit" | "view", data: ProgramConfig, attendanceProgramStage: string): CustomAttributeProps[] {
    const days: CustomAttributeProps[] = [];

    if (attendanceMode === "edit") {
        const originalData = ((data?.programStages?.find(programStge => programStge.id === attendanceProgramStage)) ?? [] as unknown as ProgramConfig["programStages"][0])

        days.push(
            ...originalData?.programStageDataElements?.map((programStageDataElement) => {
                return {
                    id: programStageDataElement.dataElement.id,
                    displayName: programStageDataElement.dataElement.displayName,
                    header: programStageDataElement.dataElement.displayName,
                    required: programStageDataElement.compulsory,
                    name: programStageDataElement.dataElement.displayName,
                    labelName: programStageDataElement.dataElement.displayName,
                    valueType: programStageDataElement.dataElement.optionSet?.options?.length > 0 ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : programStageDataElement.dataElement.valueType as unknown as CustomAttributeProps["valueType"],
                    options: { optionSet: programStageDataElement.dataElement.optionSet },
                    initialOptions: { optionSet: programStageDataElement.dataElement.optionSet },
                    visible: programStageDataElement.displayInReports,
                    disabled: false,
                    pattern: '',
                    searchable: false,
                    error: false,
                    content: '',
                    key: programStageDataElement.dataElement.id,
                    type: VariablesTypes.Attendance
                }
            }) as []
        )
    } else {
        validDays.map((dateString: { schoolDay: boolean, date: string }) => {
            days.push(
                {
                    id: dateString.date,
                    displayName: dateString.date,
                    header: dateString.date,
                    required: true,
                    name: dateString.date,
                    labelName: dateString.date,
                    valueType: Attribute.valueType.TEXT as unknown as CustomAttributeProps["valueType"],
                    options: undefined,
                    initialOptions: undefined,
                    visible: true,
                    disabled: false,
                    pattern: '',
                    searchable: false,
                    error: false,
                    content: '',
                    key: "",
                    type: VariablesTypes.Attendance,
                    class: "center",
                    schoolDay: dateString.schoolDay
                }
            )
        })
    }

    return days
}
