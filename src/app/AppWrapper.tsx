import React from 'react'
import { useDataStore } from '../hooks'
import { AppProps } from '../types/app/AppTypes';
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { useGetProgramRules } from '../hooks/programRules/useGetProgramRules';
import { useGetProgramRulesVariables } from '../hooks/programRules/useGetProgramRulesVariables';


export default function AppWrapper(props: AppProps) {
    const { children } = props
    const { error, loading } = useDataStore()
    const { loadingPRules } = useGetProgramRules();
    const { loadingPRulesVariables } = useGetProgramRulesVariables();

    if (loading || loadingPRulesVariables || loadingPRules) {
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
