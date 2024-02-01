import React from 'react'
import { TableSortLabel } from '@material-ui/core';

interface TableSortProps {
    children?: React.ReactNode
    active: boolean
    direction?: 'asc' | 'desc'
    createSortHandler: (rowsPerPage: string) => void
}

function SortLabel(props: TableSortProps): React.ReactElement {
    return (
        <TableSortLabel
            active={props.active}
            direction={props.direction}
            style={{ width: "max-content" }}
            onClick={(page: any) => { props.createSortHandler(page) }}
        >
            {props.children}
        </TableSortLabel>
    )
}

export default SortLabel
