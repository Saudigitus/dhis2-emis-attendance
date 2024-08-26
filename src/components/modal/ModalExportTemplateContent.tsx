import React, { useState, useRef } from "react";
import { ModalActions, Button, ButtonStrip, Tag, IconInfo16 } from "@dhis2/ui";
import { Form } from "react-final-form";
import GroupForm from "../form/GroupForm";
import { type ModalExportTemplateProps } from "../../types/modal/ModalTypes";
import { useParams } from "../../hooks";
import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys";
import useGetExportTemplateForm from "../../hooks/form/useGetExportTemplateForm";
import { formFields } from "../../utils/constants/exportTemplate/exportEmptyTemplateForm";
import { addDays } from "date-fns";
import { dataExporter } from "../../hooks/dataExporter/dataExporter";
import { ProgressState } from "../../schema/linearProgress";
import { useRecoilValue } from "recoil";
import { CircularLoader, CenteredContent } from "@dhis2/ui";
import CircularWithValueLabel from "../progress/circularPRogress";
import styles from './modal.module.css'

function ModalExportTemplateContent(props: ModalExportTemplateProps): React.ReactElement {
  const { setOpen, sectionName } = props;
  const { exportFormFields } = useGetExportTemplateForm();
  const { registration } = getDataStoreKeys()
  const { urlParamiters } = useParams();
  const { school: orgUnit, schoolName: orgUnitName, academicYear, class: section, grade } = urlParamiters();
  const formRef: React.MutableRefObject<FormApi<IForm, Partial<IForm>>> = useRef(null);
  const [initialValues] = useState<object>({
    orgUnitName,
    [registration?.academicYear]: academicYear,
    [registration?.grade]: grade,
    [registration?.section]: section
  })
  const [selected, setSelected] = useState([{
    startDate: new Date(),
    endDate: addDays(new Date(), 31),
    key: 'selection'
  }])
  const { exporter } = dataExporter({ school: orgUnit as unknown as string, selectedDates: selected })
  const updateProgress = useRecoilValue(ProgressState)

  const modalActions = [
    { id: "cancel", type: "button", label: updateProgress?.progress != null ? "Close" : "Cancel", onClick: () => { setOpen(false) } },
    { id: "downloadTemplate", type: "submit", label: "Download template", primary: true, className: updateProgress?.progress != null && styles.remove }
  ];

  return (
    <div>
      {
        updateProgress?.progress != null &&
        <div className={styles.overlay_div} style={{ height: "76.2vh" }} >
          <CenteredContent>
            <CircularWithValueLabel />
          </CenteredContent>
        </div>
      }

      < >
        <Tag positive icon={<IconInfo16 />} maxWidth="100%">
          This file will allow the import of new {sectionName} attendance data into the system. Please respect the blocked fields to avoid conflicts.
        </Tag>

        <Form initialValues={{ ...initialValues, orgUnit }} onSubmit={() => { }}>
          {({ form }) => {
            formRef.current = form;
            return <form
              onSubmit={async (e) => {
                e.preventDefault()
                await exporter()
              }}
            >
              {
                formFields(exportFormFields, sectionName)?.map((field: any, index: number) => {
                  return (
                    <GroupForm
                      name={field.section}
                      description={field.description}
                      key={index}
                      fields={field.fields}
                      disabled={updateProgress.progress !== null}
                      value={selected}
                      setValue={setSelected}
                    />
                  )
                })
              }
              <br />
              <ModalActions>
                <ButtonStrip end>
                  {modalActions.map((action, i) => {
                    return (
                      <Button key={i} {...action} >
                        {action.label}
                      </Button>
                    )
                  })}
                </ButtonStrip>
              </ModalActions>
            </form>
          }}
        </Form>
      </>
    </div >
  )
}

export default ModalExportTemplateContent;
