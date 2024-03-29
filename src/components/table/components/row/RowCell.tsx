import React from 'react'
import classNames from 'classnames';
import defaultClasses from '../table.module.css';
import { RowCellProps } from '../../../../types/table/TableContentTypes';

function RowCell(props: RowCellProps): React.ReactElement {
    const { children, className, passOnProps, table, colspan, onClick, cellClass } = props;

    const classes = classNames(
        defaultClasses.tableCell,
        {
            [defaultClasses.tableCellBody]: table == null,
            [defaultClasses.tableCellHeader]: table?.head,
            [defaultClasses.tableCellFooter]: table?.footer
        },
        className
    );

    return (
        <td
            className={classes}
            {...passOnProps}
            colSpan={colspan}
            onClick={onClick}
        >
            <div className={defaultClasses[cellClass as unknown as string]} >
                {children}
            </div>
        </td>
    );
};

export default RowCell
