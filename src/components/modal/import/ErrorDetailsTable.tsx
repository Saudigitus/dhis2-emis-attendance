import React from 'react';
import i18n from '@dhis2/d2-i18n'
import {
    DataTable,
    DataTableHead,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableRow
} from '@dhis2/ui'
import { useRecoilValue } from "recoil";
import { ImportStatsSchema } from '../../../schema/importStatsSchema';


export const ErrorDetailsTable = (): React.ReactElement => {
    const stats = useRecoilValue(ImportStatsSchema)

    return (
        <>
            <DataTable>
                <DataTableHead>
                    <DataTableRow>
                        <DataTableCell colSpan="3" error>
                            {i18n.t("Errors")}
                        </DataTableCell>
                    </DataTableRow>
                    <DataTableRow>
                        <DataTableColumnHeader tag={"th"}>Error Code</DataTableColumnHeader>
                        <DataTableColumnHeader>UID</DataTableColumnHeader>
                        <DataTableColumnHeader>Tracker Type</DataTableColumnHeader>
                        <DataTableColumnHeader>Error Message</DataTableColumnHeader>
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    {
                        stats.errorDetails.map((error, idx) => (
                            <DataTableRow key={idx}>
                                <DataTableCell>{error.errorCode}</DataTableCell>
                                <DataTableCell error>{error.uid}</DataTableCell>
                                <DataTableCell>{error.trackerType}</DataTableCell>
                                <DataTableCell>{error.message}</DataTableCell>
                            </DataTableRow>)
                        )
                    }
                </DataTableBody>
            </DataTable>
        </>
    )
}
