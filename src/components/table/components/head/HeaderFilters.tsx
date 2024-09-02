import React from "react";
import { Chip } from "@dhis2/ui";
import { SelectedDateAddNewState } from "../../../../schema/attendanceSchema";
import { format } from "date-fns";
import { TableColumnState } from "../../../../schema/tableColumnsSchema";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./header.module.css";
import { useHeader, useAttendanceMode } from "../../../../hooks";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";
import { Button, IconView24, IconViewOff24 } from "@dhis2/ui";
import { ReasonOfAbsenseState } from "../../../../schema/reasonOfAbsenseSchema";
import { useAttendanceConst } from "../../../../utils/constants/attendance/attendanceConst";
import {
  AccessTime,
  CheckCircleOutline,
  HighlightOff,
} from "@material-ui/icons";
import { getIcon } from "../../../../utils/table/attendance/getIcom";
import { bulkActionsState } from "../../../../schema/bulkActionsSchema";

function HeaderFilters({ bulkAction }: any) {
  const { columns } = useHeader();
  const [updatedCols, setTableColumns] = useRecoilState(TableColumnState);
  const { selectedDate } = useRecoilValue(SelectedDateAddNewState);
  const [seeReason, setSeeReason] = useRecoilState(ReasonOfAbsenseState);
  const [bulkActions, setBulkActions] = useRecoilState(bulkActionsState);
  const { attendanceMode } = useAttendanceMode();

  const setTableHeaders = (tableHeaders: any) => setTableColumns(tableHeaders);
  const handleClick = () => setSeeReason(!seeReason);

  const [disabled, _] = React.useState(false);

  return (
    <div className={styles.headerFilterContainer}>
      <EnrollmentFilters />
      <div className="mt-2">
        {attendanceMode === "edit" ? (
          <>
            <span
              style={{
                padding: "5px 10px",
                margin: "5px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
              onClick={() => setBulkActions("present")}
            >
              <CheckCircleOutline
                style={disabled ? styles : { color: "#21B26D" }}
              />
            </span>
            <span
              style={{
                padding: "5px 10px",
                margin: "5px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
              onClick={() => setBulkActions("late")}
            >
              <AccessTime style={disabled ? styles : { color: "#EAB631" }} />
            </span>
            <span
              style={{
                padding: "5px 10px",
                margin: "5px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
              onClick={() => setBulkActions("absent")}
            >
              <HighlightOff style={disabled ? styles : { color: "#F05C5C" }} />
            </span>
            <Chip selected>
              Selected date:{" "}
              {selectedDate &&
                format(selectedDate as unknown as Date, "dd/MM/yyyy")}
            </Chip>
          </>
        ) : (
          <Button
            onClick={handleClick}
            icon={seeReason ? <IconViewOff24 /> : <IconView24 />}
          >
            {seeReason ? "Hide Reason of Absense" : "View Reason of Absense"}
          </Button>
        )}
        <ConfigTableColumns
          filteredHeaders={updatedCols}
          headers={columns}
          updateVariables={setTableHeaders}
        />
      </div>
    </div>
  );
}

export default HeaderFilters;
