import {type AttendanceOptionsProps} from "../../../types/variables/AttributeColumns";
import React from "react";
import * as Icons from "@material-ui/icons";
import {Tooltip} from "@mui/material";

export const getIcon = (option: AttendanceOptionsProps) => {
    const Icon: React.FC<{ style: Record<string, unknown> }> = Icons[option.icon as unknown as keyof typeof Icons]

    return <Tooltip title={option.key}>
        <Icon style={{color: option.color}}/>
    </Tooltip>
}
