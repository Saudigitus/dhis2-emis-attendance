import React from 'react'
import { useDataStore } from '../hooks'
import { AppProps } from '../types/app/AppTypes';
import { CenteredContent, CircularLoader } from "@dhis2/ui";


export default function AppWrapper(props: AppProps) {
    const { children } = props
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
        <>{children}</>
    )
}
