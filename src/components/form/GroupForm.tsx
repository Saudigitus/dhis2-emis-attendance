import { Label } from "@dhis2/ui";
import React from "react";
import WithPadding from "../template/WithPadding";
import GenericFields from "../genericFields/GenericFields";
import styles from './groupform.module.css'
import { type GroupFormProps } from "../../types/form/GroupFormProps";
import classNames from "classnames";
import Subtitle from "../text/Subtitle";
import { useRecoilValue } from "recoil";
import { ProgressState } from "../../schema/linearProgress";

function GroupForm(props: GroupFormProps) {
    const { name, fields, description, trackedEntity, setValue, value, disabled } = props
    const updateProgress = useRecoilValue(ProgressState)

    return (
        <>
            <WithPadding p={name ? "16px 5px 0px 5px" : "0px"}>
                {name ?
                    <>
                        <Subtitle label={name} />
                        {description ?
                            <>
                                <WithPadding />
                                <Label className={styles.label}>{description}</Label>
                                <WithPadding p="0.2rem" />
                            </>
                            : null
                        }
                    </>
                    : null
                }


                <WithPadding p={"5px 10px"}>
                    {fields?.filter((x: any) => x.visible)?.map((x: any, i: number) => {
                        return (
                            <div className={classNames("row d-flex align-items-center", x.error ? styles.fieldError : x.warning ? styles.fieldWarning : styles.fieldNormal)} key={i}
                                style={{ display: "flex" }}>
                                <div className="col-12 col-md-6 d-flex" style={{ ...(updateProgress?.progress != null ? { opacity: "0.4" } : {}) }}>
                                    <Label className={styles.label}>
                                        {x.labelName} {x.required ? " *" : ""}
                                    </Label>
                                </div>
                                <div className="col-12 col-md-6">
                                    <GenericFields
                                        attribute={
                                            { ...x, trackedEntity, ...(updateProgress?.progress != null ? { style: { opacity: "0.1" } } : {}) }
                                        }
                                        disabled={!!(x.disabled || disabled)}
                                        valueType={x.valueType}
                                        setValue={setValue}
                                        value={value}
                                    />
                                    <span className={styles.content}>
                                        {x.content}
                                    </span>
                                </div>
                            </div>
                        )
                    }
                    )}
                </WithPadding>
            </WithPadding>
        </>
    )
}

export default GroupForm;
