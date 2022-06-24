import { getLanguage } from "@/utils/locale";
import {
    localeState,
    useGlobalStateValue,
} from "@kl-engineering/frontend-state";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React,
{
    useEffect,
    useState,
} from "react";
import { RawIntlProvider } from "react-intl";

interface Props {
}

const LocaleProvider: React.FC<Props> = (props) => {
    const localeStateValue = useGlobalStateValue(localeState);
    const languageCode = localeStateValue ?? `en`;
    const locale = getLanguage(languageCode);
    const [ pickerLanguage, setPickerLanguage ] = useState<Record<string, any>>();

    const loadPickerLanguage = async (locale: string) => {
        const pickerCode = locale ? locale.toLowerCase()
            .split(`-`)
            .at(0) : `en`;
        const language = pickerCode !== `en` ? (await import(`dayjs/locale/${pickerCode}.js`)).default : undefined;
        setPickerLanguage(language);
    };

    useEffect(() => {
        if (!locale) return;
        loadPickerLanguage(locale.locale);
    }, [ locale ]);

    return (
        <RawIntlProvider value={locale}>
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
