import React, { useState } from 'react'
import { IconUserGroup16, IconAddCircle24, Button, ButtonStrip } from "@dhis2/ui";
import DropdownButtonComponent from '../../../buttons/DropdownButton';
import { type FlyoutOptionsProps } from '../../../../types/buttons/FlyoutOptions';
import { useParams } from '../../../../hooks/commons/useQueryParams';
import Tooltip from '@material-ui/core/Tooltip';
import { Event } from '@material-ui/icons';
import DropDownCalendar from '../../../datepicker/DropDownCalendar';
import { useSetRecoilState } from 'recoil';
import { SelectedDateAddNewState, SelectedDateState } from '../../../../schema/attendanceSchema';
import ModalComponent from '../../../modal/Modal';
import ImportContent from '../../../modal/ImportContent';
import { useAttendanceMode } from '../../../../hooks/attendanceMode/useAttendanceMode';

function EnrollmentActionsButtons() {
  const { useQuery } = useParams();
  const orgUnit = useQuery().get("school")
  const setSelectedDate = useSetRecoilState(SelectedDateState)
  const setSelectedDateAddNew = useSetRecoilState(SelectedDateAddNewState)
  const { setAttendanceMode } = useAttendanceMode()
  const [open, setOpen] = useState<boolean>(false);
  const [openImport, setOpenImport] = useState<boolean>(false);
  const [anchorElAddNew, setAnchorElAddNew] = useState<null | HTMLElement>(null);
  const [anchorViewLast, setAnchorViewLast] = useState<null | HTMLElement>(null);
  const [localAttendanceMode, setlocalAttendanceMode] = useState<"edit" | "view">("view");

  const enrollmentOptions: FlyoutOptionsProps[] = [
    { label: "Import students", divider: true, onClick: () => { setOpenImport(true); } },
    { label: "Export empty template", divider: false, onClick: () => { alert("Export empty template"); } },
    { label: "Export template with data", divider: false, onClick: () => { alert("Export template with data"); } }
  ];

  const closeAnchor = () => {
    setAnchorElAddNew(null);
    setAnchorViewLast(null);
  };

  return (
    <div>
      <ButtonStrip>
        <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
          <span onClick={(event: React.MouseEvent<HTMLElement>) => { setAnchorElAddNew(event.currentTarget); setlocalAttendanceMode("edit") }}>
            <Button icon={<IconAddCircle24 />}>Add new event</Button>
          </span>
        </Tooltip>

        <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
          <span onClick={(event: React.MouseEvent<HTMLElement>) => { setAnchorViewLast(event.currentTarget); setlocalAttendanceMode("view") }}>
            <Button icon={<Event />}>View last events</Button>
          </span>
        </Tooltip>

        <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
          <span>
            <DropdownButtonComponent
              disabled={orgUnit == null}
              name="Bulk enrollment"
              icon={<IconUserGroup16 />}
              options={enrollmentOptions}
            />
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

      {/* View last events */}
      <DropDownCalendar
        close={closeAnchor}
        open={Boolean(anchorViewLast)}
        anchorEl={anchorViewLast}
        setValue={setSelectedDate}
        localAttendanceMode={localAttendanceMode}
        setAttendanceMode={setAttendanceMode}
      />
      {openImport && <ModalComponent title="Import Students" open={openImport} setOpen={setOpenImport}><ImportContent setOpen={setOpen} /></ModalComponent>}
    </div>
  )
}

export default EnrollmentActionsButtons
