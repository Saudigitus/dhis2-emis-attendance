import WithPadding from "../../template/WithPadding"
import { RowCell, RowTable, TableComponent } from "../../table/components"
import RenderHeader from "../../table/render/RenderHeader"
import { useRowStyles } from "../../table/render/RenderRows"
import WithBorder from "../../template/WithBorder"
import { usetStyles } from "../../table/render/Table"
import headers from '../../../utils/constants/importAttendance/infoTableHeaders.json'
import classNames from "classnames"

export default function InfoTable({ data, sheet }: { data: any, sheet: String }) {
    const classes = usetStyles()
    const rowClasses = useRowStyles()

    return (
        <WithPadding>
            <h1 style={{ fontSize: "19px", margin: "0 0 15px 0" }} >Sheet {sheet} error info</h1>
            <WithBorder type='all'>
                <div className={classes.tableContainer} >
                    <TableComponent>
                        <>
                            <RenderHeader
                                createSortHandler={() => { }}
                                rowsHeader={headers}
                            />
                            {
                                data.map((row: any, index: number) => {
                                    const cells = headers?.map(column => (
                                        <RowCell
                                            key={column.id}
                                            className={classNames(rowClasses.cell, rowClasses.bodyCell)}
                                            cellClass={column?.class}
                                        >
                                            {row[column.id]}
                                        </RowCell>
                                    ));

                                    return (
                                        <RowTable
                                            key={index}
                                            className={classNames(rowClasses.row, rowClasses.dataRow)}
                                            inactive={false}
                                        >
                                            {cells}
                                        </RowTable>
                                    );
                                })
                            }
                        </>
                    </TableComponent>
                </div>
            </WithBorder>
        </WithPadding>
    )
}