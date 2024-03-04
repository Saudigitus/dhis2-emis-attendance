import React from 'react'
import { useDataStore } from '../hooks'
import { CenteredContent, CircularLoader } from "@dhis2/ui";

interface Props {
    children: React.ReactNode
}

export default function AppWrapper(props: Props) {
    const { error, loading } = useDataStore()

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error != null) {
        return (
            <CenteredContent>
                Something went wrong wen loading the app, please check if you app is already configured
            </CenteredContent>
        )
    }

    return (
        <>{props.children}</>
    )
}
