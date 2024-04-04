import React, { useEffect } from 'react'
import style from "../layout.module.css"
import { InfoPage, MainHeader, SideBar } from '../../components'
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { useGetInitialValues, useGetProgramConfig, useParams } from '../../hooks'
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { getDataStoreKeys } from '../../utils/commons/dataStore/getDataStoreKeys';

export default function FullLayout({ children }: { children: React.ReactNode }) {
    useGetInitialValues()
    const { isSetSectionType } = useGetInitialValues()
    const { loading } = useGetProgramConfig();
    const { urlParamiters, add } = useParams()
    const { academicYear, school } = urlParamiters()

    const { currentAcademicYear } = getDataStoreKeys()

    useEffect(() => {
        if ((academicYear === null || academicYear === undefined) || (typeof academicYear === "string" && academicYear?.length === 0)) {
            add("academicYear", currentAcademicYear)
        }
    }, [academicYear])

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
                <main className={style.MainContentContainer}>
                    {
                        (school === null || school === undefined) ? <InfoPage /> : children
                    }
                </main>
            </div>
        </div>
    )
}
