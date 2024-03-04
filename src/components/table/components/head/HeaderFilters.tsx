import React from "react";
import { Chip } from "@dhis2/ui";
import { format } from "date-fns";
import { useRecoilValue } from "recoil";
import { useHeader, useAttendanceMode } from "../../../../hooks";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";
import { SelectedDateAddNewState } from "../../../../schema/attendanceSchema";

function HeaderFilters() {
  const { columns } = useHeader();
  const { selectedDate } = useRecoilValue(SelectedDateAddNewState)
  const { attendanceMode } = useAttendanceMode()

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <EnrollmentFilters />
      <div className="mt-2">
        {
          attendanceMode === 'edit' &&
          <Chip selected>
            Selected date: {format(selectedDate, 'dd/MM/yyyy')}
          </Chip>
        }
        <ConfigTableColumns headers={columns} updateVariables={() => { }} />
      </div>
    </div>
  );
}

export default HeaderFilters;
