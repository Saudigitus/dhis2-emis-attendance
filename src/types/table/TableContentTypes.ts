import { CustomAttributeProps } from "../variables/AttributeColumns"

interface TableComponentProps {
    children?: React.ReactNode
    className?: string
}

interface TableProps {
    head: any
    footer: any
}
interface HeaderCellProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: TableProps
    colspan?: number
}

interface RowProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: TableProps
}

interface RenderHeaderProps {
    rowsHeader: CustomAttributeProps[]
    orderBy: string
    order: "asc" | "desc"
    createSortHandler: (property: string) => any
}

interface RenderRowsProps {
    headerData: CustomAttributeProps[],
    rowsData: any[],
    attendanceMode: "view" | "edit"
    setTableData: any
}

interface TableSortProps {
    children?: React.ReactNode
    active: boolean
    direction?: 'asc' | 'desc'
    createSortHandler: (rowsPerPage: string) => void
}

interface RowCellProps {
    children?: React.ReactNode,
    className?: string,
    passOnProps?: object,
    table?: TableProps,
    colspan?: number,
    onClick?: () => void,
    cellClass?: string
}

interface RowTableProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: TableProps
}

type TableDataProps = Record<string, string>;


export type { TableComponentProps, HeaderCellProps, RowProps, RenderHeaderProps, TableSortProps, TableDataProps, RowCellProps, RowTableProps, RenderRowsProps }