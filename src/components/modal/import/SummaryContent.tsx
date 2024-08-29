import React, { useState } from 'react';
import { DataTable, DataTableBody, DataTableCell, DataTableRow, } from '@dhis2/ui'

interface SummaryRowProps {
    data: any
    reference: string
    expandedRows: any[]
    expandedToggle: any
    chip: string
    index: number
}

export const SummaryRow = (props: SummaryRowProps): React.ReactElement => {
    const { data, reference, expandedRows, expandedToggle, chip, index } = props

    return (
        <DataTableRow
            expanded={expandedRows.includes(reference)}
            onExpandToggle={() => expandedToggle(`${reference}`)}
        >
            <DataTableCell align="center">{chip == 'invalidSheets' ? index + 1 : data?.ref}</DataTableCell>
            {chip !== 'invalidSheets' && <DataTableCell align="center">{data?.school}</DataTableCell>}
            <DataTableCell align="center">{data?.name}</DataTableCell>
            <DataTableCell align="center">{chip == 'invalidSheets' ? data.description : data?.columns}</DataTableCell>
        </DataTableRow>
    )
}

interface SummaryTableProps {
    displayData: Record<string, any>[]
    activeTab: string
    chip: string
}

export const SummaryTable = (props: SummaryTableProps): React.ReactElement => {
    const { displayData, activeTab, chip } = props
    const [expandedRows, setExpandedRows] = useState<string[]>([])
    const recordsName = activeTab === "new" ? "new students" : activeTab

    console.log(displayData,'dataaa')

    const expandedToggle = (rowId: string) => {
        if (expandedRows.includes(rowId)) {
            setExpandedRows(expandedRows.filter((row) => row !== rowId))
        } else {
            setExpandedRows([...expandedRows, rowId])
        }
    }

    return (
        <  >
            <DataTable>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center", background: "#eee", fontSize: "15px", padding: "10px", fontWeight: "400" }}>Ref</th>
                        <th style={{ textAlign: "center", background: "#eee", fontSize: "15px", padding: "10px", fontWeight: "400" }}>Name</th>

                        {
                            chip == 'invalidSheets' ?
                                <th style={{ textAlign: "center", background: "#eee", fontSize: "15px", padding: "10px", fontWeight: "400" }}>Description</th>
                                :
                                <>
                                    <th style={{ textAlign: "center", background: "#eee", fontSize: "15px", padding: "10px", fontWeight: "400" }}>School</th>
                                    <th style={{ textAlign: "center", background: "#eee", fontSize: "15px", padding: "10px", fontWeight: "400" }}>{activeTab === 'invalid' ? 'invalidSheets attendance cells' : 'Filled attendance cells'}</th>
                                </>
                        }
                    </tr>
                </thead>
                <DataTableBody>
                    {
                        displayData?.map((student, index) => {
                            return (
                                <SummaryRow
                                    key={`student-${student.ref}`}
                                    reference={`student-${student.ref}`}
                                    data={student}
                                    expandedRows={expandedRows}
                                    expandedToggle={expandedToggle}
                                    chip={chip}
                                    index={index}
                                />
                            )
                        })
                    }
                    {(displayData?.length === 0) &&
                        <DataTableRow>
                            <DataTableCell>{`No ${recordsName} to display!`}</DataTableCell>
                        </DataTableRow>
                    }
                </DataTableBody>
            </DataTable>

        </>)
}
