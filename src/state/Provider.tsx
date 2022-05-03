/* eslint-disable react/prop-types */
import LocaleProvider from "@/locale/Provider";
import { StateProvider as KLStateProvider } from "@kl-engineering/frontend-state";
import React from "react";

interface StateProviderProps {
}

const StateProvider: React.FC<StateProviderProps> = (props) => {
    return (
        <KLStateProvider cookieDomain={process.env.COOKIE_DOMAIN ?? ``}>
            <LocaleProvider>
                {props.children}
            </LocaleProvider>
        </KLStateProvider>
    );
};

export default StateProvider;
