import "@babel/polyfill";
import LogRocket from "logrocket";
LogRocket.init("8qowji/badanamu-learning-pass");
import "node-source-han-sans-sc/SourceHanSansSC-Regular-all.css";
import "typeface-nanum-square-round";
import "./assets/css/index.min.css";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient, ApolloLink } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "kidsloop-px";
import React, { useMemo } from "react";
import * as ReactDOM from "react-dom";
import { RawIntlProvider } from "react-intl";
import { Provider, useSelector } from "react-redux";
import { Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { cache } from "./cache";
import { getAPIEndpoint } from "./config";
import { Layout } from "./layout";
import { createDefaultStore, State } from "./store/store";
import { themeProvider } from "./themeProvider";
import { redirectIfUnauthorized } from "./utils/accountUtils";
import { history } from "./utils/history";
import { getLanguage } from "./utils/locale";
import Cookies, { useCookies } from "react-cookie";

const link = createUploadLink({
    credentials: "include",
    uri: `${getAPIEndpoint()}user/`,
});

export const client = new ApolloClient({
    credentials: "include",
    link: ApolloLink.from([link]),
    cache,
});

function ClientSide() {
    const memos = useMemo(() => {
        const url = new URL(window.location.href);
        const locale = url.searchParams.get("iso");
        return { hostName: url.hostname, locale };
    }, []);

    const testing = memos.hostName === "localhost";

    const [cookies] = useCookies(["locale"]);
    const languageCode = memos.locale ?? cookies.locale ?? useSelector((state: State) => state.ui.locale || "");
    const locale = getLanguage(languageCode);

    return (
        <ApolloProvider client={client}>
            <RawIntlProvider value={locale}>
                <ThemeProvider theme={themeProvider()}>
                    <SnackbarProvider closeButtonLabel="Dismiss">
                        <CssBaseline />
                        <Layout />
                    </SnackbarProvider>
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
