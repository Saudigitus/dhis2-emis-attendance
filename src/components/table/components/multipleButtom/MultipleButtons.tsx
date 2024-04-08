import React from "react";
import styles from "./button.module.css";
import {ButtonGroup, Button} from "@material-ui/core";
import {type ButtonProps} from "../../../../types/table/MultipleButtonsTypes";

export default function MultipleButtons(props: ButtonProps) {
    const {
        items,
        selectedTerm,
        setSelectedTerm,
        disabled
    } = props;

    return (
        <ButtonGroup color="primary">
            {items?.map((item) => (
                <Button disabled={item.disabled || disabled} key={item?.code}
                        className={selectedTerm === item?.code && styles["active-button"]}
                        onClick={() => {
                            setSelectedTerm(item.code, item.type)
                        }}>
                    <span className={styles.simpleButtonLabel}>{item.Component}</span>
                </Button>
            ))}
        </ButtonGroup>
    );
}
