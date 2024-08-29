import React, { useEffect, useState } from "react";
import { TabBar, Tab } from '@dhis2/ui'
import { Pagination } from "../../table/components";
import { SummaryTable } from "./SummaryContent";
import { Badge, Box, Chip, Stack } from "@mui/material";

const SummaryDetails = ({ summaryData }: { summaryData: any }): React.ReactElement => {
    const [invalidSheets, setInvalidData] = useState<any>([])
    const [data, setData] = useState<any>([])
    const [activeTab, setActiveTab] = useState({ chip: "", tab: "new" })
    const [pagination, setPagination] = useState<any>({ new: { page: 1, pageSize: 10 }, invalid: { page: 1, pageSize: 10 } });
    const currentPage = pagination[activeTab.tab]?.page;
    const tabPageSize = pagination[activeTab.tab]?.pageSize;
    const displayData = summaryData?.summary?.[activeTab?.chip]?.[activeTab?.tab]?.slice((currentPage - 1) * tabPageSize, currentPage * tabPageSize)

    useEffect(() => {
        if (activeTab.chip == 'invalidSheets') {
            setData(invalidSheets)
        } else {
            setData(summaryData?.summary?.[activeTab?.chip]?.[activeTab?.tab]?.slice((currentPage - 1) * tabPageSize, currentPage * tabPageSize))
        }
    }, [activeTab])

    const handlePageChange = (newPage: number) => {
        setPagination((prev: any) => ({
            ...prev,
            [activeTab.tab]: { ...prev[activeTab.tab], page: newPage }
        }));
    };

    useEffect(() => {
        if (summaryData?.summary) {
            let invalidSheets: any = []

            const activeChip = Object?.keys(summaryData?.summary ?? {})[0]
            setActiveTab((active: any) => ({ ...active, chip: activeChip }))

            summaryData?.invalidSheetNames.map((name: string) => {
                invalidSheets.push({ name: name, description: 'You either renamed or added this sheet into you excel file' })
            })

            summaryData?.sheetsWithInvaliHEaders.map((name: string) => {
                invalidSheets.push({ name: name, description: 'This sheet contains invalid headers' })
            })

            setInvalidData(invalidSheets)
        }
    }, [summaryData])

    function isInvalid(sheetName: string) {
        if (sheetName) {
            const index = summaryData?.invalidSheetNames.indexOf(sheetName)
            const index2 = summaryData?.sheetsWithInvaliHEaders.indexOf(sheetName)

            if (index == -1 && index2 == -1) return false
            return true
        }
        return false
    }

    return (
        <>
            <Stack direction="row" sx={{ flexWrap: 'wrap', margin: "7px 5px 0 5px" }} spacing={1}>
                {Object?.keys(summaryData?.summary ?? {})?.map((label) => {
                    if (!isInvalid(label))
                        return <Chip
                            label={label}
                            variant="outlined"
                            onClick={() => setActiveTab({ tab: "new", chip: label })}
                            sx={{
                                margin: "2px",
                                backgroundColor: activeTab.chip == label ? '#D8DBE2' : '#F4F4F9',
                                '&:hover': {
                                    backgroundColor: activeTab.chip == label ? '#D8DBE2' : '#F4F4F9',
                                    color: '#000'
                                }
                            }}
                        />
                })}

                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <Chip
                        sx={{ margin: "2px", backgroundColor: activeTab.chip == 'invalidSheets' ? '#D8DBE2' : '#FFECE7' }}
                        label="Invalid Sheets"
                        variant="outlined"
                        onClick={() => setActiveTab({ tab: "", chip: 'invalidSheets' })}
                        disabled={invalidSheets?.length == 0}
                    />
                    <Badge
                        badgeContent={invalidSheets?.length}
                        color="error"
                        sx={{ position: 'absolute', top: 5, right: 5 }}
                    />
                </Box>
            </Stack>

            <>
                {activeTab.chip != 'invalidSheets' &&
                    <TabBar>
                        <Tab onClick={() => { setActiveTab((active: any) => ({ ...active, tab: 'new' })) }} selected={activeTab.tab === 'new'}>
                            {summaryData.summary?.[activeTab?.chip]?.new.length}<br /> New Attendances Rows
                        </Tab>
                        <Tab onClick={() => { setActiveTab((active: any) => ({ ...active, tab: 'invalid' })) }} selected={activeTab.tab === 'invalid'}>
                            {summaryData.summary?.[activeTab?.chip]?.invalid.length}<br /> Invalid Attendance Rows
                        </Tab>
                    </TabBar>
                }

                <br />

                <div style={{ height: "137px", overflow: "auto" }}>

                    <SummaryTable
                        displayData={data}
                        activeTab={activeTab.tab}
                        chip={activeTab.chip}
                    />

                    <br />
                    {summaryData.summary?.[activeTab?.chip]?.[activeTab?.tab]?.length > 0 && <Pagination
                        page={currentPage}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={() => { }}
                        rowsPerPage={tabPageSize}
                        loading={false}
                        totalPerPage={displayData?.length}
                    />}
                </div>
            </>
        </>)
}

export default SummaryDetails;
