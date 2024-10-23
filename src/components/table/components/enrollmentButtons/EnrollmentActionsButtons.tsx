import React, { useState } from 'react'
import { Event } from '@material-ui/icons';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Tooltip from '@material-ui/core/Tooltip';
import { useParams, useAttendanceMode } from '../../../../hooks';
import { IconAddCircle24, Button, ButtonStrip, IconCalendar24 } from "@dhis2/ui";
import { SelectedDateAddNewState, SelectedDateState } from '../../../../schema/attendanceSchema';
import { DropdownButtonComponent, DropDownCalendar, ImportContent, ModalComponent } from '../../../../components';
import useGetSectionTypeLabel from '../../../../hooks/commons/useGetSectionTypeLabel';
import { ProgressState } from '../../../../schema/linearProgress';
import ModalExportTemplateContent from '../../../modal/export/ModalExportTemplateContent';
import { useDisableBulkOperations } from '../../../../hooks/commons/useDisableBulkOperations';

function EnrollmentActionsButtons() {
  const { urlParamiters } = useParams();
  const { school: orgUnit, grade, class: section } = urlParamiters()
  const setSelectedDate = useSetRecoilState(SelectedDateState)
  const setSelectedDateAddNew = useSetRecoilState(SelectedDateAddNewState)
  const { disable } = useDisableBulkOperations()
  const { setAttendanceMode } = useAttendanceMode()
  const [anchorElAddNew, setAnchorElAddNew] = useState<null | HTMLElement>(null);
  const [anchorViewLast, setAnchorViewLast] = useState<null | HTMLElement>(null);
  const [localAttendanceMode, setlocalAttendanceMode] = useState<"edit" | "view">("view");
  const { sectionName } = useGetSectionTypeLabel();
  const [openExportEmptyTemplate, setOpenExportEmptyTemplate] = useState<boolean>(false);
  const [openImportTemplate, setOpenImportTemplate] = useState<boolean>(false);
  const progress = useRecoilValue(ProgressState)

  const closeAnchor = () => {
    setAnchorElAddNew(null);
    setAnchorViewLast(null);
  };

  const bulkOptions = [
    { label: `Import ${sectionName} attendances`, divider: true, onClick: () => setOpenImportTemplate(true) },
    { label: `Export ${sectionName} attendances`, divider: false, onClick: () => setOpenExportEmptyTemplate(true) }
  ];


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

        <DropdownButtonComponent
          name={<span >Bulk attendance</span> as unknown as string}
          disabled={disable() || progress?.progress1 != null}
          icon={<IconCalendar24 />}
          options={bulkOptions}
        />
      </ButtonStrip>

      {openExportEmptyTemplate && <ModalComponent title={`Data Import Template Export`} open={openExportEmptyTemplate} setOpen={setOpenExportEmptyTemplate}>
        <ModalExportTemplateContent
          sectionName={sectionName}
          setOpen={setOpenExportEmptyTemplate}
        />
      </ModalComponent>}

      {openImportTemplate &&
        <ImportContent
          sectionName={sectionName}
          setOpen={setOpenImportTemplate}
          open={openImportTemplate}
        />}

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
        setAddNew={setSelectedDateAddNew}
        localAttendanceMode={localAttendanceMode}
        setAttendanceMode={setAttendanceMode}
      />
    </div>
  )
}

export default EnrollmentActionsButtons
