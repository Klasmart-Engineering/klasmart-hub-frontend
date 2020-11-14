import "@babel/polyfill";
import LogRocket from "logrocket";
LogRocket.init("8qowji/badanamu-learning-pass");

import "node-source-han-sans-sc/SourceHanSansSC-Regular-all.css";
import "typeface-nanum-square-round";
import "./assets/css/index.min.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createUploadLink } from "apollo-upload-client";
import { cache } from "./pages/admin/kidsloop-orgadmin-fe/src/cache";

import { ApolloClient, ApolloLink } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import * as ReactDOM from "react-dom";
import { createIntl, RawIntlProvider } from "react-intl";
import { Provider, useSelector } from "react-redux";
import { HashRouter, Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Layout } from "./layout";
import { createDefaultStore, State } from "./store/store";
import { themeProvider } from "./themeProvider";
import { redirectIfUnauthorized } from "./utils/accountUtils";
import { history } from "./utils/history";
import { getLanguage } from "./utils/locale";

const link = createUploadLink({
    credentials: "include", 
    uri: "https://api.kidsloop.net/user/",
});

export const client = new ApolloClient({
    credentials: "include",
    link: ApolloLink.from([link]),
    cache,
});


function ClientSide() {
    const memos = useMemo(() => {
        const url = new URL(window.location.href);
        return { hostName: url.hostname };
    }, []);

    const testing = memos.hostName === "localhost";

    const languageCode = useSelector((state: State) => state.ui.locale || "");
    const locale = getLanguage(languageCode);

    return (
        <ApolloProvider client={client}>
            <RawIntlProvider value={locale}>
                <ThemeProvider theme={themeProvider()}>
                    <CssBaseline />
                    <Layout />
                </ThemeProvider>
            </RawIntlProvider>
        </ApolloProvider>
    );
}

async function main() {
    const { store, persistor } = createDefaultStore();
    if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const axe = require("react-axe");
        // axe(React, ReactDOM, 1000);
    }

    if (window.location.host.split(":")[0] !== "localhost") {
        redirectIfUnauthorized();
    }

    const div = document.getElementById("app");
    ReactDOM.render(
        <Router history={history}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ClientSide />
                </PersistGate>
            </Provider>
        </Router>,
        div);
}

main();
