import React from "react";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import { useHeader } from "../../../../hooks/tableHeader/useHeader";
import { Chip } from "@dhis2/ui";
import { useRecoilValue } from "recoil";
import { SelectedDateAddNewState } from "../../../../schema/attendanceSchema";
import { useAttendanceMode } from "../../../../hooks/attendanceMode/useAttendanceMode";
import { format } from "date-fns";
import { VariablesTypes } from "../../../../types/table/AttributeColumns";

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
        <ConfigTableColumns headers={columns.filter(x => x.type !== VariablesTypes.Attendance)} updateVariables={() => { }} />
      </div>
    </div>
  );
}

export default HeaderFilters;
