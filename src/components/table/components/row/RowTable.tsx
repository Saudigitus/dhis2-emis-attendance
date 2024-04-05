import React from 'react'
import classNames from 'classnames';
import defaultClasses from '../table.module.css';
import { type RowTableProps } from '../../../../types/table/TableContentTypes';

function RowTable(props: RowTableProps): React.ReactElement {
    const { children, className, table, passOnProps, inactive = false } = props;

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
        <tr
            className={classes}
            {...passOnProps}
        >
            {children}
        </tr>
    )
}

export default RowTable
