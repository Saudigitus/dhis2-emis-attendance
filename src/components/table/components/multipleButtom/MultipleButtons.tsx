import React from "react";
import styles from "./button.module.css";
import { ButtonGroup, Button } from "@material-ui/core";

interface MultipleButtonsProps {
    code: string
    type: string
    Component: any
}

interface ButtonProps {
    id: string
    selectedTerm: any
    items: MultipleButtonsProps[]
    setSelectedTerm: any
}

export default function MultipleButtons(props: ButtonProps) {
    const { items, selectedTerm, setSelectedTerm, id } = props;

    return (
        <ButtonGroup color="primary">
            {items?.map((item) => (
                <Button key={item?.code} className={selectedTerm === item?.code && styles["active-button"]} onClick={() => { setSelectedTerm(item.code) }}>
                    <span className={styles.simpleButtonLabel}>{item.Component}</span>
                </Button>
            ))}
        </ButtonGroup>
    );
}
