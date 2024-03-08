import React from "react";
import { Chip } from "@dhis2/ui";
import { useRecoilState, useRecoilValue } from "recoil";
import { SelectedDateAddNewState } from "../../../../schema/attendanceSchema";
import { useAttendanceMode } from "../../../../hooks/attendanceMode/useAttendanceMode";
import { format } from "date-fns";
import { TableColumnState } from "../../../../schema/tableColumnsSchema";
import { useRecoilValue } from "recoil";
import styles from './header.module.css'
import { useHeader, useAttendanceMode } from "../../../../hooks";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";

function HeaderFilters() {
  const { columns } = useHeader();
  const [updatedCols, setTableColumns] = useRecoilState(TableColumnState)
  const { selectedDate } = useRecoilValue(SelectedDateAddNewState)
  const { attendanceMode } = useAttendanceMode()

  const setTableHeaders = (tableHeaders: any) => setTableColumns(tableHeaders)

  return (
    <div className={styles.headerFilterContainer}>
      <EnrollmentFilters />
      <div className="mt-2">
        {
          attendanceMode === 'edit' &&
          <Chip selected>
            Selected date: {format(selectedDate, 'dd/MM/yyyy')}
          </Chip>
        }
        <ConfigTableColumns filteredHeaders={updatedCols} headers={columns} updateVariables={setTableHeaders} />
      </div>
    </div>
  );
}

export default HeaderFilters;
