import React, { useState, useEffect } from "react";
import { ButtonStrip } from "@dhis2/ui";
import SummaryCard from "../../card/SummaryCard";

function SummaryCards(props: any): React.ReactElement {
    const [summary, setSummary] = useState({ new: 0, invalid: 0 })

    useEffect(() => {
        let summary = { new: 0, invalid: 0 }

        Object.keys(props?.summary ?? {}).map((sheet) => {
            console.log(props?.summary[sheet])
            props?.summary[sheet].new.map((x: any) => {
                summary.new = summary.new + x.columns
            })
            props?.summary[sheet].invalid.map((x: any) => {
                summary.invalid = summary.invalid + x.columns
            })
        })

        setSummary(summary)
    }, [props])

    return (
        <ButtonStrip>
            <SummaryCard color="success" label="New Attendances" value={summary.new.toString()} />
            <SummaryCard color="error" label="Invalid Attendances" value={summary.invalid.toString()} />
        </ButtonStrip>
    )
}

export default SummaryCards;
