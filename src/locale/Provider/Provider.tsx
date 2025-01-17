/* eslint-disable react/prop-types */
import { getLanguage } from "@/locale/utils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    localeState,
    useGlobalStateValue,
} from "@kl-engineering/frontend-state";
import { RawIntlProvider } from "react-intl";
import { useEffect, useState } from "react";

interface LocaleProviderProps {
}

const LocaleProvider: React.FC<LocaleProviderProps> = (props) => {
    const locale = useGlobalStateValue(localeState);
    const langage = getLanguage(locale);
    const [pickerLanguage, setPickerLanguage] = useState<Record<string, any>>();

    const loadPickerLanguage = async (locale: string) => {
        const pickerCode = locale ? locale.toLowerCase()
            .split(`-`)
            .at(0) : `en`;
        const language = pickerCode !== `en` ? (await import(`dayjs/locale/${pickerCode}.js`)).default : undefined;
        setPickerLanguage(language);
    };

    useEffect(() => {
        if (!locale) return;
        loadPickerLanguage(locale);
    }, [locale]);

    return (
        <RawIntlProvider value={langage}>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                locale={pickerLanguage}
            >
                {props.children}
            </LocalizationProvider>
        </RawIntlProvider>
    );
};

export default LocaleProvider;
