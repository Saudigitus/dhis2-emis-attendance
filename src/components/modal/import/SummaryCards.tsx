import React from "react";
import { ButtonStrip } from "@dhis2/ui";
import SummaryCard from "../../card/SummaryCard";

function SummaryCards(props: any): React.ReactElement {

    return (
        <ButtonStrip>
            <SummaryCard color="success" label="New Records" value={props?.summary?.new?.length.toString()} />
            <SummaryCard color="warning" label="Invalid Records" value={props?.summary?.invalid?.length.toString()} />
            <SummaryCard color="error" label="Invalid Sheets" value={props?.summary?.invalidSheets?.length.toString()} />
        </ButtonStrip>
    )
}

export default SummaryCards;
