import { createIntl, createIntlCache } from "react-intl";
import english from "./en";
import korean from "./ko";
import chinese from "./zh_cn";
import vietnamese from "./vi";
import indonesian from "./id";
import { Language } from "kidsloop-px/dist/types/components/LanguageSelect";

export const localeCodes = ["en-US", "ko", "zh-CN", "vi", "id"];
export const LANGUAGES_LABEL: Language[] = [
    {
        code: "en-US",
        text: "English",
    },
    {
        code: "ko",
        text: "한국어",
    },
    {
        code: "zh-CN",
        text: "汉语 (简体)",
    },
    {
        code: "vi",
        text: "Tiếng Việt",
    },
    {
        code: "id",
        text: "bahasa Indonesia",
    },
];

const intlCache = createIntlCache();
export const fallbackLocale = createIntl({ locale: "en", messages: english }, intlCache);
export function getIntl(locale: string) {
    switch (locale) {
        case "en":
            return createIntl({ locale: "en-US", messages: english }, intlCache);
        case "ko":
            return createIntl({ locale: "ko", messages: korean }, intlCache);
        case "zh-CN":
            return createIntl({ locale: "zh-CN", messages: chinese }, intlCache);
        case "vi":
            return createIntl({ locale: "vi", messages: vietnamese }, intlCache);
        case "id":
            return createIntl({ locale: "id", messages: indonesian }, intlCache);
    }
}
