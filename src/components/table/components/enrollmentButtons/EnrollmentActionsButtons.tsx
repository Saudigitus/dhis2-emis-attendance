import React, { useState } from 'react'
import { Event } from '@material-ui/icons';
import { useSetRecoilState } from 'recoil';
import Tooltip from '@material-ui/core/Tooltip';
import { useParams, useAttendanceMode } from '../../../../hooks';
import { IconAddCircle24, Button, ButtonStrip } from "@dhis2/ui";
import { SelectedDateAddNewState, SelectedDateState } from '../../../../schema/attendanceSchema';
import {  DropDownCalendar } from '../../../../components';

function EnrollmentActionsButtons() {
  const { useQuery } = useParams();
  const orgUnit = useQuery().get("school")
  const setSelectedDate = useSetRecoilState(SelectedDateState)
  const setSelectedDateAddNew = useSetRecoilState(SelectedDateAddNewState)
  const { setAttendanceMode } = useAttendanceMode()
  const [anchorElAddNew, setAnchorElAddNew] = useState<null | HTMLElement>(null);
  const [anchorViewLast, setAnchorViewLast] = useState<null | HTMLElement>(null);
  const [localAttendanceMode, setlocalAttendanceMode] = useState<"edit" | "view">("view");

  const closeAnchor = () => {
    setAnchorElAddNew(null);
    setAnchorViewLast(null);
  };

  return (
    <div>
      <ButtonStrip>
        <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
          <span onClick={(event: React.MouseEvent<HTMLElement>) => { setAnchorElAddNew(event.currentTarget); setlocalAttendanceMode("edit") }}>
            <Button icon={<IconAddCircle24 />}>Take attendance</Button>
          </span>
        </Tooltip>

        <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
          <span onClick={(event: React.MouseEvent<HTMLElement>) => { setAnchorViewLast(event.currentTarget); setlocalAttendanceMode("view") }}>
            <Button icon={<Event />}>View attendance records</Button>
          </span>
        </Tooltip>
      </ButtonStrip>

      {/* Add new events */}
      <DropDownCalendar
        close={closeAnchor}
        open={Boolean(anchorElAddNew)}
        anchorEl={anchorElAddNew}
        setValue={setSelectedDateAddNew}
        localAttendanceMode={localAttendanceMode}
        setAttendanceMode={setAttendanceMode}
      />

      {/* View attendance records */}
      <DropDownCalendar
        close={closeAnchor}
        open={Boolean(anchorViewLast)}
        anchorEl={anchorViewLast}
        setValue={setSelectedDate}
        localAttendanceMode={localAttendanceMode}
        setAttendanceMode={setAttendanceMode}
      />
    </div>
  )
}

export default EnrollmentActionsButtons
