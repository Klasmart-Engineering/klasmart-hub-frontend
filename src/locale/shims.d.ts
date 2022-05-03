declare module "" {
  export interface IntlFormatters<T = any, R = T> {
    // formatDateTimeRange(from: Parameters<DateTimeFormat['formatRange']>[0], to: Parameters<DateTimeFormat['formatRange']>[1], opts?: FormatDateOptions): string;
    // formatDate(value: Parameters<Intl.DateTimeFormat['format']>[0] | string, opts?: FormatDateOptions): string;
    // formatTime(value: Parameters<Intl.DateTimeFormat['format']>[0] | string, opts?: FormatDateOptions): string;
    // formatDateToParts(value: Parameters<Intl.DateTimeFormat['format']>[0] | string, opts?: FormatDateOptions): Intl.DateTimeFormatPart[];
    // formatTimeToParts(value: Parameters<Intl.DateTimeFormat['format']>[0] | string, opts?: FormatDateOptions): Intl.DateTimeFormatPart[];
    // formatRelativeTime(value: Parameters<Intl.RelativeTimeFormat['format']>[0], unit?: Parameters<Intl.RelativeTimeFormat['format']>[1], opts?: FormatRelativeTimeOptions): string;
    // formatNumber(value: Parameters<Intl.NumberFormat['format']>[0], opts?: FormatNumberOptions): string;
    // formatNumberToParts(value: Parameters<Intl.NumberFormat['format']>[0], opts?: FormatNumberOptions): Intl.NumberFormatPart[];
    // formatPlural(value: Parameters<Intl.PluralRules['select']>[0], opts?: FormatPluralOptions): ReturnType<Intl.PluralRules['select']>;
    formatMessage(descriptor: MessageDescriptor, values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>, opts?: IntlMessageFormatOptions): string;
    // formatMessage(descriptor: MessageDescriptor, values?: Record<string, PrimitiveType | T | FormatXMLElementFn<T, R>>, opts?: IntlMessageFormatOptions): R;
    // formatList(values: ReadonlyArray<string>, opts?: FormatListOptions): string;
    // formatList(values: ReadonlyArray<string | T>, opts?: FormatListOptions): T | string | Array<string | T>;
    // formatListToParts(values: ReadonlyArray<string | T>, opts?: FormatListOptions): Part[];
    // formatDisplayName(value: Parameters<DisplayNames['of']>[0], opts: FormatDisplayNameOptions): string | undefined;
  }
}