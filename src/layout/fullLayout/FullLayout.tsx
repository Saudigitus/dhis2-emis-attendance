import React from 'react'
import style from "../layout.module.css"
import { MainHeader, SideBar } from '../../components'
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { useGetInitialValues, useGetProgramConfig } from '../../hooks'
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';

export default function FullLayout({ children }: { children: React.ReactNode }) {
    useGetInitialValues()
    const { isSetSectionType } = useGetInitialValues()
    const { loading } = useGetProgramConfig();

    if (!isSetSectionType) {
        return (
            <CenteredContent>
                Cant load the app without section type
            </CenteredContent>
        )
    }

    if (loading) {
    return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <div className={style.LayoutContainer}>
            <SideBar />
            <div className={style.FullLayoutContainer}>
                <MainHeader />
                <main className={style.MainContentContainer}>{children}</main>
            </div>
        </div>
    )
}
