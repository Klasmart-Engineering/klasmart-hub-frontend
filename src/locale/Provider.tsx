/* eslint-disable react/prop-types */
import { getLanguage } from "@/utils/locale";
import {
    localeState,
    useStateValue,
} from "@kl-engineering/frontend-state";
import React,
{ useMemo } from "react";
import { RawIntlProvider } from "react-intl";

interface LocaleProviderProps {
}

const LocaleProvider: React.FC<LocaleProviderProps> = (props) => {
    const locale = useStateValue(localeState);

    const language = useMemo(() => getLanguage(locale), [ locale ]);

    return (
        <RawIntlProvider value={language}>
            {props.children}
        </RawIntlProvider>
    );
};

export default LocaleProvider;
