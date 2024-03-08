import React, { useEffect, useState } from 'react'
import RenderRows from './RenderRows'
import RenderHeader from './RenderHeader'
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { TeiRefetch } from '../../../schema/refecthTeiSchema';
import { WithBorder, WithPadding } from '../../../components';
import { HeaderFieldsState } from '../../../schema/headersSchema';
import { SelectedDateState } from '../../../schema/attendanceSchema';
import { HeaderFilters, Pagination, TableComponent, WorkingLits} from '../components'
import { useHeader, useTableData, useParams, useAttendanceMode  } from '../../../hooks';

const usetStyles = makeStyles({
    tableContainer: {
        overflowX: 'auto'
    }
});

function Table() {
    const classes = usetStyles()
    const { columns } = useHeader()
    const { getData, loading, tableData, getAttendanceData, setTableData } = useTableData()
    const { useQuery } = useParams()
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { selectedDate: selectedDateViewMode } = useRecoilValue(SelectedDateState)
    const [page, setpage] = useState(1)
    const [pageSize, setpageSize] = useState(10)
    const [refetch] = useRecoilState(TeiRefetch)
    const { setInitialAttendanceMode, attendanceMode } = useAttendanceMode()

    useEffect(() => {
        void getData(page, pageSize)
        setInitialAttendanceMode()
    }, [useQuery(), headerFieldsState, page, pageSize, refetch])

    useEffect(() => {
        void getAttendanceData()
    }, [selectedDateViewMode])

    const onPageChange = (newPage: number) => {
        setpage(newPage)
    }

    const onRowsPerPageChange = (event: any) => {
        setpageSize(parseInt(event.value, 10))
        setpage(1)
    }

    return (
        <Paper>
            {loading &&
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            }
            <WorkingLits />
            <WithBorder type='bottom' />
            <WithPadding >
                <WithBorder type='all' >
                    <HeaderFilters attendanceMode={attendanceMode} />
                    <div
                        className={classes.tableContainer}
                    >
                        <TableComponent>
                            <>
                                <RenderHeader
                                    createSortHandler={() => { }}
                                    order='asc'
                                    orderBy='desc'
                                    rowsHeader={columns}
                                />
                                <RenderRows
                                    headerData={columns}
                                    rowsData={tableData}
                                    attendanceMode={attendanceMode}
                                    setTableData={setTableData}
                                />
                            </>
                        </TableComponent>
                    </div>
                    <Pagination
                        loading={loading}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                        page={page}
                        rowsPerPage={pageSize}
                        totalPerPage={tableData?.length}
                    />
                </WithBorder>
            </WithPadding>
        </Paper>
    )
}

export default Table
