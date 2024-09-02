import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCreateDataValues, useUpdateEvents } from "../../../hooks";
import { VariablesTypes } from "../../../types/variables/AttributeColumns";
import MultipleButtons from "../components/reasonOfAbsence/multipleButtom/MultipleButtons";
import { SelectedDateAddNewState } from "../../../schema/attendanceSchema";
import { type AttendanceEditModeProps } from "../../../types/table/TableRenderTypes";
import { type AttendanceOptionsProps } from "../../../types/variables/AttributeColumns";
import { getSelectedKey } from "../../../utils/commons/dataStore/getSelectedKey";
import { getDisplayName } from "../../../utils/table/rows/getDisplayNameByOption";
import { useAttendanceConst } from "../../../utils/constants/attendance/attendanceConst";
import { ProgramConfigState } from "../../../schema/programSchema";
import { checkCanceled } from "../../../utils/table/rows/checkCanceled";
import { getIcon } from "../../../utils/table/attendance/getIcom";
import ReasonOfAbsence from "../components/reasonOfAbsence/reasonOfAbsesnce";
import { bulkActionsState } from "../../../schema/bulkActionsSchema";
import useCheckIfAttendanceElement from "../../../hooks/events/useCheckIfAttendanceElement";

function AttendanceEditMode(props: AttendanceEditModeProps) {
  const { column, value, rowsData, setTableData, getAttendanceData } = props;
  const [selectedTerm, setselectedTerm] = useState<string>("");
  const { getDataStoreData } = getSelectedKey();
  const attendanceId = getDataStoreData.attendance.status;
  const absentId = getDataStoreData.attendance.absenceReason;
  const dataStoreOptions = getDataStoreData.attendance.statusOptions;
  const { selectedDate } = useRecoilValue(SelectedDateAddNewState);
  const { createValues } = useCreateDataValues();
  const { updateValues } = useUpdateEvents();
  const { attendanceConst } = useAttendanceConst();
  const programConfigState = useRecoilValue(ProgramConfigState);
  const { isAttendanceDataElement } = useCheckIfAttendanceElement();

  const [bulkActions, setBulkActions] = useRecoilState<any>(bulkActionsState);

  const date = format(new Date(selectedDate as unknown as Date), "yyyy-MM-dd");

  function getValueBySelectedDate() {
    const valueByDate = value?.[date];

    if (column.id === attendanceId) {
      setselectedTerm(valueByDate?.status);
    } else if (column.id === absentId) {
      setselectedTerm(valueByDate?.absenceOption);
    }
  }

  function onChangeAttendance(v: string, type: string) {
    console.log("values: ", {
      dataElementId: column.id,
      dataElementValue: v,
      rowsData,
      setTableData,
      teiDetails: value,
      typeField: type,
      setselectedTerm,
    });

    // return
    if (value[date]?.eventId) {
      void updateValues({
        dataElementId: column.id,
        dataElementValue: v,
        rowsData,
        setTableData,
        teiDetails: value,
        typeField: type,
        setselectedTerm,
      });
    } else {
      void createValues({
        dataElementId: column.id,
        dataElementValue: v,
        rowsData,
        setTableData,
        teiDetails: value,
        typeField: type,
        setselectedTerm,
      });
    }
  }

  const handleBulkAction = async () => {
    if (await isAttendanceDataElement(column.id, bulkActions)) {
      onChangeAttendance(bulkActions, VariablesTypes.Attendance);
      setBulkActions(null);
      getAttendanceData()
    }
  };

  useEffect(() => {
    if (bulkActions) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleBulkAction();
    }
  }, [bulkActions]);

  useEffect(() => {
    getValueBySelectedDate();
  }, [value, selectedDate]);

  return (
    <>
      {column.type === VariablesTypes.Attendance
        ? attendanceOptionIcons(
            props,
            selectedTerm,
            dataStoreOptions,
            onChangeAttendance,
            attendanceId,
            value?.status,
            value?.[date],
            attendanceConst
          )
        : getDisplayName({
            metaData: column.id,
            value: value[column.id],
            program: programConfigState,
          })}
    </>
  );
}

export default AttendanceEditMode;

function attendanceOptionIcons(
  props: AttendanceEditModeProps,
  selectedTerm: string,
  dataStoreOptions: AttendanceOptionsProps[],
  setselectedTerm: any,
  attendanceId: string,
  enrollmentStatus: string,
  value: any,
  attendanceConst: any
) {
  return props.column.id === attendanceId ? (
    <MultipleButtons
      id={props.column.id}
      items={itemsAttendance(
        dataStoreOptions,
        props.column,
        checkCanceled(enrollmentStatus)
      )}
      selectedTerm={selectedTerm}
      setSelectedTerm={setselectedTerm}
      disabled={checkCanceled(enrollmentStatus)}
    />
  ) : (
    value?.status === attendanceConst("absent") && (
      <ReasonOfAbsence
        id={props.column.id}
        items={itemsAbsence(props.column)}
        selectedTerm={selectedTerm}
        setSelectedTerm={setselectedTerm}
        disabled={checkCanceled(enrollmentStatus)}
      />
    )
  );
}

function itemsAttendance(
  dataStoreOptions: AttendanceOptionsProps[],
  programOptions: AttendanceEditModeProps["column"],
  disabled: boolean
) {
  return dataStoreOptions?.map((option) => {
    return {
      code: option.code,
      type: "attendance",
      Component: getIcon(option, disabled),
    };
  }) as [];
}

function itemsAbsence(options: AttendanceEditModeProps["column"]) {
  return options.options?.optionSet.options.map((option) => {
    return {
      code: option.value,
      type: "absence",
      Component: option.label,
    };
  }) as [];
}
