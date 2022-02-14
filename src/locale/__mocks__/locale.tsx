import { fallbackLocale } from "@/locale/locale";
import { createTheme, StyledEngineProvider, ThemeProvider, Theme } from '@mui/material/styles';
import { render } from "@testing-library/react";
import React from "react";
import {
    createIntl,
    createIntlCache,
    RawIntlProvider,
} from "react-intl";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const theme = createTheme();

const mockIntlCache = createIntlCache();

export const mockOnTranslationError = jest.fn(console.error);

export const mockIntl = createIntl({
    locale: fallbackLocale.locale,
    messages: fallbackLocale.messages,
    onError: mockOnTranslationError,
}, mockIntlCache);

export const withMockIntl = (ui: React.ReactNode) => <RawIntlProvider value={mockIntl}>
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            {ui}
        </ThemeProvider>
    </StyledEngineProvider></RawIntlProvider>;

export function renderWithIntl (ui: React.ReactNode) {
    return render(withMockIntl(ui));
}
