import React from "react";
import styles from "./button.module.css";
import { ButtonStrip } from "@dhis2/ui";
import { ButtonGroup } from "@material-ui/core";
import { Button } from "@material-ui/core";

interface MultipleButtonsProps {
    id: string
    type: string
    Component: any
}

interface ButtonProps {
    items: MultipleButtonsProps[]
    selectedTerm: any
    setSelectedTerm: (arg: object) => void
}

export default function MultipleButtons(props: ButtonProps) {
    const { items, selectedTerm, setSelectedTerm } = props;

    return (
        <ButtonGroup color="primary">
            {items?.map((item) => (
                <Button key={item?.id} className={selectedTerm?.id === item?.id && styles["active-button"]} onClick={() => { setSelectedTerm(item) }}>
                    <span className={styles.simpleButtonLabel}>{item.Component}</span>
                </Button>
            ))}
        </ButtonGroup>
    );
}
