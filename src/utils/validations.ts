export function alphanumeric(name: string): boolean {
    const regularExpression = /[^a-zA-Z0-9\s]/;
    return regularExpression.test(name);
}

export const phoneNumberRegex = /^\++?[1-9][0-9]\d{6,14}$/;

export const emailAddressRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const formatPermissionName = (str: string) =>
    str.replace(/[^A-Za-z]+/g, ` `).replace(/(?:^|\s|[_"'([{])+\S/g, (match) => match.toUpperCase());
