import { trimStrings } from "./objectCleaner";

describe(`clean object data`, () => {
    const blob = new Blob([ `blob` ]);
    const date = new Date();
    const file = new File([ `fileBlob` ], `fileName`);
    const str = `String input`;

    test(`trim strings`, () => {
        expect(trimStrings(``)).toBe(``);
        expect(trimStrings({})).toMatchObject({});
        expect(trimStrings([])).toMatchObject([]);
        expect(trimStrings(null)).toBeNull();
        expect(trimStrings(undefined)).toBeUndefined();
        expect(trimStrings({
            str: ` ${str} `,
            arr: [
                ` ${str} `,
                `${str} `,
                ` ${str}`,
                {
                    nested: ` ${str} `,
                },
            ],
            blob,
            file,
            date,
        })).toMatchObject({
            str: str,
            arr: [
                str,
                str,
                str,
                {
                    nested: str,
                },
            ],
            blob,
            file,
            date,
        });
    });
});
