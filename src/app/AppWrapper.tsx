import React from 'react'
import { useDataStore } from '../hooks'
import { AppProps } from '../types/app/AppTypes';
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { useGetProgramRules } from '../hooks/programRules/useGetProgramRules';
import { useGetProgramRulesVariables } from '../hooks/programRules/useGetProgramRulesVariables';
import { useOrgUnitsGroups } from '../hooks/orgUnitsGroup/useOrgUnitsGroups';
import { useGetOptionGroups } from '../hooks/optionGroup/useGetOptionGroups';
import { useGetSchoolDays } from '../hooks/schoolDays/useGetSchoolDays';
import { useGetSysInfo } from '../hooks/system/info';

export default function AppWrapper(props: AppProps) {
    const { children } = props
    const { error, loading } = useDataStore()
    const { loadingPRules } = useGetProgramRules();
    const { loadingPRulesVariables } = useGetProgramRulesVariables();
    const { loadingOptionGroups } = useGetOptionGroups();
    const { loadingOrgUnitsGroups } = useOrgUnitsGroups()
    const { loadingSchoolDays } = useGetSchoolDays()
    const { loading: loadingInfo, error: infoError } = useGetSysInfo()

    if (loadingInfo || loadingSchoolDays || loading || loadingPRulesVariables || loadingPRules || loadingOptionGroups || loadingOrgUnitsGroups) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error != null && infoError != null) {
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
