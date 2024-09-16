import React, { useState, useEffect } from "react";
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
import { useRecoilState, useSetRecoilState } from "recoil";
import ImportProgress from "./importProgress";
import useUploadEvents from "../../../hooks/events/useUploadEvents";
import { LinearProgress } from "@material-ui/core";
import { ImportStatsSchema } from "../../../schema/importStatsSchema";

interface ModalContentProps {
    setOpen: (value: boolean) => void
    summaryData: any
    sheetData: {
        attendanceEvents: any[],
        trackedEntityIds: {
            tei: string,
            enrollment: string
        }[],
        dateRange: {
            sDate: Date,
            eDate: Date
        }
    }
}

const ModalSummaryContent = (props: ModalContentProps): React.ReactElement => {
    const { setOpen, summaryData, sheetData } = props;
    const [showDetails, setShowDetails] = useState(false)
    const [doneProcessing, setDoneProcessing] = useState({ validate: false, commit: false })
    const { getAttendanceData } = useTableData()
    const { uploadValues, useUpdateValues } = useUploadEvents()
    const { getDataStoreData } = getSelectedKey()
    const [progress, updateProgress] = useRecoilState(ProgressState)
    const setStats = useSetRecoilState(ImportStatsSchema)

    function splitArrayIntoChunks(array: any[], chunkSize: number) {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            result.push(chunk);
        }
        return result;
    }

    useEffect(() => {
        if (progress?.progress >= 100) {
            const timeout = setTimeout(() => {
                updateProgress({ progress: null, buffer: null });
            }, 400);
            return () => clearTimeout(timeout)
        }
    }, [progress?.progress])

    async function importAttendanceValues(importMode: "VALIDATE" | "COMMIT") {
        updateProgress((progress: any) => ({ progress: 0, buffer: 10 }))
        setStats({ statsCount: { created: 0, ignored: 0, total: 0, updated: 0 }, errorDetails: [] })

        const attData = await getAttendanceData({ dealingWithExcel: true, ...sheetData.dateRange, trackedEntityIds: sheetData.trackedEntityIds })

        const separatedEvents = getEventsToUpate(sheetData.attendanceEvents, attData, getDataStoreData.attendance.status)
        const toRegister = splitArrayIntoChunks(separatedEvents.new, 60)
        const toUpdate = splitArrayIntoChunks(separatedEvents.toUpdate, 60)
        const newTotalLoad = separatedEvents.toUpdate.length > 0 ? 30 : 60
        const updateTotalLoad = separatedEvents.new.length > 0 ? 30 : 60

        if (toRegister.length > 0) {
            for (const events of toRegister) {
                await uploadValues(events, importMode).finally(() => {
                    updateProgress((progress: any) => ({
                        ...progress,
                        progress: progress.progress + (newTotalLoad / toRegister.length),
                        buffer: progress.buffer + (newTotalLoad + 5 / toRegister.length)
                    }))
                })
            }
        }

        if (toUpdate.length > 0) {
            for (const event of toUpdate) {
                await useUpdateValues(event, importMode).finally(() => {
                    updateProgress((progress: any) => ({
                            ...progress,
                            progress: progress.progress + (updateTotalLoad / toUpdate.length),
                            buffer: progress.buffer + (updateTotalLoad + 5 / toUpdate.length)
                    }))
                })
            }
        }
    }

    const handleShowDetails = () => { setShowDetails(!showDetails); }

    const modalActions: ButtonActionProps[] = [
        {
            label: "Dry Run",
            loading: false,
            disabled: doneProcessing.validate || doneProcessing.commit,
            onClick: () => {
                setDoneProcessing({ validate: true, commit: false })
                void importAttendanceValues('VALIDATE')
            },
            className: progress?.progress != null && styles.remove
        },
        {
            label: "Import new students",
            primary: true,
            loading: false,
            disabled: doneProcessing.commit || summaryData?.summary?.new?.length === 0,
            onClick: () => {
                setDoneProcessing((done: any) => ({ ...done, commit: true }))
                void importAttendanceValues('COMMIT')
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
                (progress?.progress != null && doneProcessing.commit) ?
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

                        <SummaryCards doneProcessing={doneProcessing.commit || doneProcessing.validate} {...summaryData} />

                        <WithPadding />
                        <ButtonStrip>
                            <Button small icon={<InfoOutlined className={styles.infoIcon} />} onClick={handleShowDetails}>More details</Button>
                        </ButtonStrip>

                        <WithPadding />
                        <Collapse in={showDetails}>
                            <div className={styles.detailsContainer}>
                                <SummaryDetails doneProcessing={doneProcessing.commit || doneProcessing.validate} summaryData={summaryData} />
                            </div>
                        </Collapse>
                        {progress?.progress != null && doneProcessing.validate && <LinearProgress />}
                        <Actions />
                    </>
            }
        </>
    );
}

export default ModalSummaryContent;
