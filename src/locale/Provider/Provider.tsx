/* eslint-disable react/prop-types */
import { getLanguage } from "@/locale/utils";
import {
    localeState,
    useGlobalStateValue,
} from "@kl-engineering/frontend-state";
import { RawIntlProvider } from "react-intl";

interface LocaleProviderProps {
}

const LocaleProvider: React.FC<LocaleProviderProps> = (props) => {
    const locale = useGlobalStateValue(localeState);
    const langage = getLanguage(locale);
    return (
        <RawIntlProvider value={langage}>
            {props.children}
        </RawIntlProvider>
    );
};

export default LocaleProvider;
