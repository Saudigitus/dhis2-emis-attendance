import React from 'react'
import classNames from 'classnames';
import defaultClasses from '../table.module.css';
import {type RowTableProps} from '../../../../types/table/TableContentTypes';
import Tooltip from "@material-ui/core/Tooltip";
import useGetSectionTypeLabel from "../../../../hooks/commons/useGetSectionTypeLabel";

function RowTable(props: RowTableProps): React.ReactElement {
    const {
        children,
        className,
        table,
        passOnProps,
        inactive = false
    } = props;
    const {sectionName} = useGetSectionTypeLabel()

    const classes = classNames(
        defaultClasses.tableRow,
        {
            [defaultClasses.tableRowBody]: table == null,
            [defaultClasses.tableRowHeader]: table?.head,
            [defaultClasses.tableRowFooter]: table?.footer
        },
        className,
        inactive && defaultClasses.disabledRow
    );

    return (
        <Tooltip arrow={true} disableHoverListener={!inactive}
                 title={inactive && 'This ' + sectionName + ' enrollment is inactive'}>
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
