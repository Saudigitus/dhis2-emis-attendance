import React from 'react'
import { CenteredContent } from "@dhis2/ui";
import style from "../Layout.module.css"
import { MainHeader, SideBar } from '../../components'
import { useGetInitialValues } from '../../hooks/initialValues/useGetInitialValues'

export default function FullLayout({ children }: { children: React.ReactNode }) {
    const { isSetSectionType } = useGetInitialValues()

    if (!isSetSectionType) {
        return (
            <CenteredContent>
                Cant load the app without section type
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
