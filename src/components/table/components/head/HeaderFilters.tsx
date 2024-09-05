import React from "react";
import { Chip, Button, IconView24, IconViewOff24 } from "@dhis2/ui";
import { SelectedDateAddNewState } from "../../../../schema/attendanceSchema";
import { format } from "date-fns";
import { TableColumnState } from "../../../../schema/tableColumnsSchema";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./header.module.css";
import { useHeader, useAttendanceMode } from "../../../../hooks";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";
import { ReasonOfAbsenseState } from "../../../../schema/reasonOfAbsenseSchema";
import { useAttendanceConst } from "../../../../utils/constants/attendance/attendanceConst";
import {
  AccessTime,
  CheckCircleOutline,
  HighlightOff,
} from "@material-ui/icons";
import { getIcon } from "../../../../utils/table/attendance/getIcom";
import { bulkActionsState } from "../../../../schema/bulkActionsSchema";
import { getSelectedKey } from "../../../../utils/commons/dataStore/getSelectedKey";

function HeaderFilters() {
  const { columns } = useHeader();
  const [updatedCols, setTableColumns] = useRecoilState(TableColumnState);
  const { selectedDate } = useRecoilValue(SelectedDateAddNewState);
  const [seeReason, setSeeReason] = useRecoilState(ReasonOfAbsenseState);
  const [bulkActions, setBulkActions] = useRecoilState(bulkActionsState);
  const { attendanceMode } = useAttendanceMode();

  const { getDataStoreData } = getSelectedKey();
  const dataStoreOptions = getDataStoreData?.attendance?.statusOptions || [];

  const setTableHeaders = (tableHeaders: any) => {
    setTableColumns(tableHeaders);
  };
  const handleClick = () => {
    setSeeReason(!seeReason);
  };

  const [disabled, _] = React.useState(false);

  return (
    <div className={styles.headerFilterContainer}>
      <EnrollmentFilters />
      <div className="mt-2">
        {attendanceMode === "edit" ? (
          <>
            {dataStoreOptions.map((option) => {
              if (option.icon === "Done") {
                return (
                  <span
                    style={{
                      padding: "5px 10px",
                      margin: "5px",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    title={`Mark all as ${option.key}`}
                    onClick={() => {
                      setBulkActions(option.code);
                    }}
                  >
                    <CheckCircleOutline
                      style={disabled ? styles : { color: option.color }}
                    />
                  </span>
                );
              }

              if (option.icon === "Clear") {
                return (
                  <span
                    style={{
                      padding: "5px 10px",
                      margin: "5px",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    title={`Mark all as ${option.key}`}
                    onClick={() => {
                      setBulkActions(option.code);
                    }}
                  >
                    <HighlightOff
                      style={disabled ? styles : { color: option.color }}
                    />
                  </span>
                );
              }
            })}

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
