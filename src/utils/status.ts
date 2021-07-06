import { IntlShape } from "react-intl";

const statusTranslations: { [key: string]: string } = {
    active: `users_activeStatus`,
    inactive: `users_inactiveStatus`,
};

export const getCustomStatus = (intl: IntlShape, status: string) => {
    const translatedStatus = statusTranslations[status];
    if (!translatedStatus) return status;
    return intl.formatMessage({
        id: translatedStatus,
    });
};
