import React, { useEffect, useState } from "react";
import { Divider, IconCheckmarkCircle16, Tag, ModalActions, Button, ButtonStrip } from "@dhis2/ui";
import WithPadding from "../../template/WithPadding";
import styles from "../modal.module.css";
import { type ButtonActionProps } from "../../../types/buttons/ButtonActions";
import Title from "../../text/Title";
import { Collapse } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import { LinearProgress } from "@material-ui/core";
import SummaryCards from "./SummaryCards";
import SummaryDetails from "./SummaryDetails";

interface ModalContentProps {
    setOpen: (value: boolean) => void
    summaryData: any
}

const ModalSummaryContent = (props: ModalContentProps): React.ReactElement => {
    const { setOpen, summaryData } = props;
    const [showDetails, setShowDetails] = useState(false)
    const [loading, setLoading] = useState(false)


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
            onClick: () => { }
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
