import React from "react";
import styles from "./button.module.css";
import {ButtonGroup, Button} from "@material-ui/core";
import {type ButtonProps} from "../../../../types/table/MultipleButtonsTypes";
import classNames from "classnames";

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
                // eslint-disable-next-line
                <Button disabled={item.disabled || disabled} key={item?.code}
                        className={classNames(
                            selectedTerm === item?.code && styles["active-button"],
                            styles.label)
                        }
                        onClick={() => { setSelectedTerm(item.code, item.type) }} >
                    <span className={styles.simpleButtonLabel}>{item.Component}</span>
                </Button>
            ))}
        </ButtonGroup>
    );
}
