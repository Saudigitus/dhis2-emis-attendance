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
import { SelectedDateAddNewState, SelectedDateState } from '../../../schema/attendanceSchema';
import { HeaderFilters, Pagination, TableComponent, WorkingLists } from '../components'
import { useHeader, useTableData, useParams, useAttendanceMode } from '../../../hooks';
import { format } from 'date-fns';
import { generateAttendanceDays } from '../../../utils/table/header/generateAttendanceDays';

export const usetStyles = makeStyles({
    tableContainer: {
        overflowX: 'auto'
    },
    workingListsContainer: {
        display: 'flex',
        marginLeft: '0.5rem',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    h4: {
        margin: '0px',
        fontSize: '22px',
        fontWeigth: '500'
    }
});

function Table() {
    const classes = usetStyles()
    const { columns } = useHeader()
    const { getData, loading, tableData, getAttendanceData, setTableData } = useTableData()
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { selectedDate: selectedDateViewMode } = useRecoilValue(SelectedDateState)
    const [selectedDateAddNew, setDateView] = useRecoilState(SelectedDateAddNewState)
    const [page, setpage] = useState(1)
    const [pageSize, setpageSize] = useState(10)
    const [refetch] = useRecoilState(TeiRefetch)
    const { attendanceMode } = useAttendanceMode()
    const { urlParamiters } = useParams()
    const { academicYear } = urlParamiters()
    const { getValidDays } = generateAttendanceDays()

    useEffect(() => {
        if (academicYear) {
            void getData(page, pageSize)
        }
    }, [headerFieldsState, page, pageSize, refetch])

    useEffect(() => {
        if (academicYear && selectedDateViewMode !== null) {
            setDateView({ selectedDate: null })
            void getAttendanceData()
        }
    }, [selectedDateViewMode])

    useEffect(() => {
        if (academicYear && selectedDateAddNew.selectedDate) {
            let days = getValidDays(new Date(selectedDateViewMode ?? new Date))
            if (!days.find(x => x.date === format(new Date(selectedDateAddNew?.selectedDate as unknown as Date), "yyyy-MM-dd")))
                void getAttendanceData()
        }
    }, [selectedDateAddNew])

    useEffect(() => {
        setpage(1)
    }, [headerFieldsState])

    const onPageChange = (newPage: number) => {
        setpage(newPage)
    }

    const onRowsPerPageChange = (event: any) => {
        setpageSize(parseInt(event.value, 10))
        setpage(1)
    }

    return (
        <Paper>
            <div className={classes.workingListsContainer}>
                <h4 className={classes.h4}>Attendances</h4>
                <WorkingLists />
            </div>
            <WithBorder type='bottom' />
            <WithPadding>
                <WithBorder type='all'>
                    <HeaderFilters />
                    <div
                        className={classes.tableContainer}
                    >
                        {loading ?
                            <CenteredContent>
                                <CircularLoader />
                            </CenteredContent>
                            :
                            <TableComponent>
                                <>
                                    <RenderHeader
                                        createSortHandler={() => {
                                        }}
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
                        }
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
