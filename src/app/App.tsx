import React from 'react'
import "./app.module.css"
import { RecoilRoot } from 'recoil';
import AppWrapper from './AppWrapper';
import "../assets/style/globalStyle.css"
import "react-select/dist/react-select.css";
import { Router } from "../components/routes"
import 'bootstrap/dist/css/bootstrap.min.css';
import { CircularLoader, CenteredContent } from "@dhis2/ui";
import { DataStoreProvider } from "@dhis2/app-service-datastore";

function App() {
    return (
        <DataStoreProvider
            namespace="emis-apps-configuration"
            loadingComponent={
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            }
        >
            <RecoilRoot>
                <AppWrapper>
                    <Router />
                </AppWrapper>
            </RecoilRoot>
        </DataStoreProvider>
    )
}
export default App
