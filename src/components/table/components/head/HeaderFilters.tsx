import React from "react";
import { Chip } from "@dhis2/ui";
import { SelectedDateAddNewState } from "../../../../schema/attendanceSchema";
import { format } from "date-fns";
import { TableColumnState } from "../../../../schema/tableColumnsSchema";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from './header.module.css'
import { useHeader, useAttendanceMode } from "../../../../hooks";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";
import { Button, IconView24, IconViewOff24 } from "@dhis2/ui";
import { ReasonOfAbsenseState } from "../../../../schema/reasonOfAbsenseSchema";

function HeaderFilters() {
  const { columns } = useHeader();
  const [updatedCols, setTableColumns] = useRecoilState(TableColumnState)
  const { selectedDate } = useRecoilValue(SelectedDateAddNewState)
  const [seeReason, setSeeReason] = useRecoilState(ReasonOfAbsenseState)
  const { attendanceMode } = useAttendanceMode()

  const setTableHeaders = (tableHeaders: any) => setTableColumns(tableHeaders)
  const handleClick = () => setSeeReason(!seeReason)

  return (
    <div className={styles.headerFilterContainer}>
      <EnrollmentFilters />
      <div className="mt-2">
        {
          attendanceMode === 'edit' ?
            <Chip selected>
              Selected date: {format(selectedDate, 'dd/MM/yyyy')}
            </Chip>
            :
            <Button onClick={handleClick} icon={seeReason ? <IconViewOff24 /> : <IconView24 />}>
              {seeReason ? 'Hide Reason of Absense' : 'View Reason of Absense'}
            </Button>
        }
        <ConfigTableColumns filteredHeaders={updatedCols} headers={columns} updateVariables={setTableHeaders} />
      </div>
    </div>
  );
}

export default HeaderFilters;
