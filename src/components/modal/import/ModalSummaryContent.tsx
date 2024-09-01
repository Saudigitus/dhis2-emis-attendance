import React, { useState } from "react";
import { IconCheckmarkCircle16, Tag, ModalActions, Button, ButtonStrip } from "@dhis2/ui";
import WithPadding from "../../template/WithPadding";
import styles from "../modal.module.css";
import { type ButtonActionProps } from "../../../types/buttons/ButtonActions";
import Title from "../../text/Title";
import { Collapse } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import { LinearProgress } from "@material-ui/core";
import SummaryCards from "./SummaryCards";
import SummaryDetails from "./SummaryDetails";
import { useCreateDataValues, useTableData, useUpdateEvents } from "../../../hooks";
import { getEventsToUpate } from "../../../utils/bulkImport/getEventsToUpdate";
import { getSelectedKey } from "../../../utils/commons/dataStore/getSelectedKey";

interface ModalContentProps {
    setOpen: (value: boolean) => void
    summaryData: any
    sheetData: { attendanceEvents: any[], trackedEntityIds: { tei: string, enrollment: string }[], dateRange: { sDate: Date, eDate: Date } }
}

const ModalSummaryContent = (props: ModalContentProps): React.ReactElement => {
    const { setOpen, summaryData, sheetData } = props;
    const [showDetails, setShowDetails] = useState(false)
    const [loading, setLoading] = useState(false)
    const { getAttendanceData } = useTableData()
    const { uploadValues } = useCreateDataValues()
    const { uploadValues: updateExistingValues } = useUpdateEvents()
    const { getDataStoreData } = getSelectedKey()

    async function importAttendanceValues() {
        await getAttendanceData({ dealingWithExcel: true, ...sheetData.dateRange, trackedEntityIds: sheetData.trackedEntityIds })
            .then(async (resp) => {
                const separatedEvents = getEventsToUpate(sheetData.attendanceEvents, resp, getDataStoreData.attendance.status)
                if (separatedEvents.new.length > 0) await uploadValues(separatedEvents.new)
                for (const event of separatedEvents.toUpdate) {
                    await updateExistingValues(event.event, event.id)
                }
            })
    }

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    }

    const modalActions: ButtonActionProps[] = [
        {
            label: "Dry Run",
            loading: false,
            disabled: false,
            onClick: () => { }
        },
        {
            label: "Import new students",
            primary: true,
            loading: false,
            disabled: false,
            onClick: () => { void importAttendanceValues() }
        },
        {
            label: "Close",
            disabled: loading,
            loading: false,
            onClick: () => {
                setOpen(false)
            }
        }
    ];

    return (
        <>
            <Tag positive icon={<IconCheckmarkCircle16 />} className={styles.tagContainer}> Attendance import preview </Tag>

            <WithPadding />
            <Title label={`Import Summary`} />
            <WithPadding />

            <SummaryCards {...summaryData} />

            <WithPadding />
            <ButtonStrip>
                <Button small icon={<InfoOutlined className={styles.infoIcon} />} onClick={handleShowDetails}>More details</Button>
            </ButtonStrip>

            <WithPadding />
            <Collapse in={showDetails}>
                <div className={styles.detailsContainer}>
                    <SummaryDetails summaryData={summaryData} />
                </div>
            </Collapse>

            {loading && <LinearProgress />}
            <ModalActions>
                <ButtonStrip end>
                    {modalActions.map((action, i) => (
                        <Button
                            key={i}
                            {...action}
                        >
                            {action.label}
                        </Button>
                    ))}
                </ButtonStrip>
            </ModalActions>
        </>
    );
}

export default ModalSummaryContent;
