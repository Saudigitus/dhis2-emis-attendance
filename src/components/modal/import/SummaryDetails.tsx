import React, { useEffect, useState } from "react";
import { TabBar, Tab } from '@dhis2/ui'
import { Pagination } from "../../table/components";
import { SummaryTable } from "./SummaryContent";

const SummaryDetails = ({ summaryData }: { summaryData: any }): React.ReactElement => {
    const [data, setData] = useState<any>([])
    const [activeTab, setActiveTab] = useState("new")
    const [pagination, setPagination] = useState<any>({ new: { page: 1, pageSize: 10 }, invalid: { page: 1, pageSize: 10 }, invalidSheets: { page: 1, pageSize: 10 } });
    const currentPage = pagination[activeTab]?.page;
    const tabPageSize = pagination[activeTab]?.pageSize;

    const handlePageChange = (newPage: number) => {
        setPagination((prev: any) => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], page: newPage }
        }));
    };

    useEffect(() => {
        setData((dados: any) => (
            [...(summaryData?.summary?.[activeTab]?.slice((currentPage - 1) * tabPageSize, currentPage * tabPageSize) ?? [])]
        ));
    }, [activeTab, summaryData, pagination])

    return (
        <>
            <TabBar>
                <Tab onClick={() => { setActiveTab('new') }} selected={activeTab === 'new'}>
                    {summaryData.summary?.new?.length}<br /> New Records
                </Tab>
                <Tab onClick={() => { setActiveTab('invalid') }} selected={activeTab === 'invalid'}>
                    {summaryData.summary?.invalid?.length}<br /> Invalid Records
                </Tab>
                <Tab onClick={() => { setActiveTab('invalidSheets') }} selected={activeTab === 'invalidSheets'}>
                    {summaryData.summary?.invalidSheets?.length}<br /> Invalid Sheets
                </Tab>
            </TabBar>

            <br />

            <div style={{ height: "137px", overflow: "auto" }}>

                <SummaryTable
                    displayData={data}
                    activeTab={activeTab}
                />

                <br />
                {summaryData.summary?.[activeTab]?.length > 0 &&
                    <Pagination
                        page={currentPage}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={() => { }}
                        rowsPerPage={tabPageSize}
                        loading={false}
                        totalPerPage={data?.length}
                    />
                }
            </div>
        </>
    )
}

export default SummaryDetails;
