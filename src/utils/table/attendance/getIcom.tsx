import {type AttendanceOptionsProps} from "../../../types/variables/AttributeColumns";
import React from "react";
import * as Icons from "@material-ui/icons";
import {Tooltip} from "@mui/material";

export const getIcon = (option: AttendanceOptionsProps, disabled = false) => {
    const Icon: React.FC<{ style: Record<string, unknown> }> = Icons?.[option.icon as unknown as keyof typeof Icons]

    return <>
        {
            // eslint-disable-next-line
            Icon ? <Tooltip title={option.key}>
                <Icon style={disabled ? { color: '#000', opacity: 0.4 } : {color: option.color}}/>
            </Tooltip> : <span style={disabled ? { color: '#000', opacity: 0.4 } : {color: option.color}}>{option?.code.substring(0, 1).toUpperCase() + option.code.substring(1, option.code.length)}</span>
        }
    </>
}
