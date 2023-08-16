import classNames from 'classnames';
import React from 'react'
import defaultClasses from '../table.module.css';

interface tableProps {
    head: any
    footer: any
}

interface RowCellProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: tableProps
    colspan?: number
}

function RowCell(props: RowCellProps): React.ReactElement {
    const { children, className, passOnProps, table, colspan } = props;

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
        >
            {children}
        </td>
    );
};

export default RowCell
