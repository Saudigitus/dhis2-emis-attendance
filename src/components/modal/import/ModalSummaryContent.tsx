import React, { useState } from "react";
import { IconCheckmarkCircle16, Tag, ModalActions, Button, ButtonStrip } from "@dhis2/ui";
import WithPadding from "../../template/WithPadding";
import styles from "../modal.module.css";
import { type ButtonActionProps } from "../../../types/buttons/ButtonActions";
import Title from "../../text/Title";
import { Collapse } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import SummaryCards from "./SummaryCards";
import SummaryDetails from "./SummaryDetails";
import { useTableData } from "../../../hooks";
import { getEventsToUpate } from "../../../utils/bulkImport/getEventsToUpdate";
import { getSelectedKey } from "../../../utils/commons/dataStore/getSelectedKey";
import { ProgressState } from "../../../schema/linearProgress";
import { useRecoilState } from "recoil";
import ImportProgress from "./importProgress";
import useUploadEvents from "../../../hooks/events/useUploadEvents";

interface ModalContentProps {
    setOpen: (value: boolean) => void
    summaryData: any
    sheetData: { attendanceEvents: any[], trackedEntityIds: { tei: string, enrollment: string }[], dateRange: { sDate: Date, eDate: Date } }
}

const ModalSummaryContent = (props: ModalContentProps): React.ReactElement => {
    const { setOpen, summaryData, sheetData } = props;
    const [showDetails, setShowDetails] = useState(false)
    const [doneProcessing, setDoneProcessing] = useState(false)
    const [importStats, setImportStats] = useState({ imported: 0, updated: 0, ignored: 0, error: 0 })
    const { getAttendanceData } = useTableData()
    const { uploadValues, useUpdateValues } = useUploadEvents()
    const { getDataStoreData } = getSelectedKey()
    const [progress, updateProgress] = useRecoilState(ProgressState)

    async function importAttendanceValues() {
        updateProgress((progress: any) => ({ progress: 0, buffer: 15 }))
        const attData = await getAttendanceData({ dealingWithExcel: true, ...sheetData.dateRange, trackedEntityIds: sheetData.trackedEntityIds })
        const separatedEvents = getEventsToUpate(sheetData.attendanceEvents, attData, getDataStoreData.attendance.status)

        if (separatedEvents.new.length > 0)
            for (let index = 0; index < separatedEvents.new.length / 20; index++) {
                await uploadValues(separatedEvents.new.slice(index * 20, (index + 1) * 20)).then((resp) => {

                    updateProgress((progress: any) => ({
                        ...progress,
                        progress: progress.progress + (40 / (separatedEvents.new.length / 20)),
                        buffer: progress.buffer + (45 / (separatedEvents.new.length / 20))
                    }))

                    setImportStats((stats) => ({ ...stats, imported: separatedEvents.new.length }))
                })
            }

        if (separatedEvents.toUpdate.length > 0)
            for (let index = 0; index < separatedEvents.toUpdate.length / 20; index++) {
                await useUpdateValues(separatedEvents.toUpdate.slice(index * 20, (index + 1) * 20)).then((res) => {
                    updateProgress((progress: any) => ({
                        ...progress,
                        progress: progress.progress + (30 / separatedEvents.toUpdate.length),
                        buffer: progress.buffer + (35 / separatedEvents.toUpdate.length)
                    }))

                    setImportStats((stats) => ({ ...stats, updated: stats.updated + 1 }))
                })
            }

        if (separatedEvents.toUpdate.length === 0 && separatedEvents.new.length === 0) {
            updateProgress((progress: any) => ({ progress: 100, buffer: 100 }))
        }
    }

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    }

    const modalActions: ButtonActionProps[] = [
        {
            label: "Dry Run",
            loading: false,
            disabled: false,
            onClick: () => { },
            className: progress?.progress != null && styles.remove
        },
        {
            label: "Import new students",
            primary: true,
            loading: false,
            disabled: false,
            onClick: () => {
                importAttendanceValues().then(() => {
                    updateProgress({ progress: 100, buffer: 100 })
                })
                    .finally(() => {
                        updateProgress({ progress: null, buffer: null })
                        setDoneProcessing(true)
                    })
            },
            className: progress?.progress != null && styles.remove
        },
        {
            label: "Close",
            disabled: false,
            loading: false,
            onClick: () => {
                setOpen(false)
            }
        }
    ];

    function Actions() {
        return (
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
        )
    }

    return (
        <>
            {
                progress?.progress != null ?
                    <>
                        <ImportProgress />
                        <Actions />
                    </>
                    :
                    <>
                        <Tag positive icon={<IconCheckmarkCircle16 />} className={styles.tagContainer}> Attendance import preview </Tag>

                        <WithPadding />
                        <Title label={`Import Summary`} />
                        <WithPadding />

                        <SummaryCards doneProcessing={doneProcessing} {...importStats} {...summaryData} />

                        <WithPadding />
                        <ButtonStrip>
                            <Button small icon={<InfoOutlined className={styles.infoIcon} />} onClick={handleShowDetails}>More details</Button>
                        </ButtonStrip>

                        <WithPadding />
                        <Collapse in={showDetails}>
                            <div className={styles.detailsContainer}>
                                <SummaryDetails doneProcessing={doneProcessing} importStats={importStats} summaryData={summaryData} />
                            </div>
                        </Collapse>

                        <Actions />
                    </>
            }
        </>
    );
}

export default ModalSummaryContent;
