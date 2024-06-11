import React from 'react'
import classNames from 'classnames';
import defaultClasses from '../table.module.css';
import { type RowTableProps } from '../../../../types/table/TableContentTypes';
import Tooltip from "@material-ui/core/Tooltip";
import useGetSectionTypeLabel from "../../../../hooks/commons/useGetSectionTypeLabel";

function RowTable(props: RowTableProps): React.ReactElement {
    const { children, className, table, inactive = false, isOwnershipOu = true, ...passOnProps } = props;
    const { sectionName } = useGetSectionTypeLabel()

    const classes = classNames(
        defaultClasses.tableRow,
        {
            [defaultClasses.tableRowBody]: table == null,
            [defaultClasses.tableRowHeader]: table?.head,
            [defaultClasses.tableRowFooter]: table?.footer
        },
        className,
        inactive && defaultClasses.disabledRow,
        !isOwnershipOu && defaultClasses.disabledRowOwnershipOu
    );

    return (
        <Tooltip arrow={true} disableFocusListener
            title={!isOwnershipOu ? 'This ' + sectionName + ' was transferred to another school' : inactive ? 'This ' + sectionName + ' enrollment is inactive' : ""}>
            <tr
                className={classes}
                {...passOnProps}
            >
                {children}
            </tr>
        </Tooltip>
    )
}

export default RowTable
