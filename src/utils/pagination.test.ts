import { isUuid } from "./pagination";
import each from "jest-each";

each([ `cc70c032-ea3e-11eb-9a03-0242ac130003`, `7713e993-69d0-4611-acdc-591bde446d31` ]).test(`%s is a valid UUID`, (uuid) => {
    expect(isUuid(uuid)).toBe(true);
});

test(`a valid UUID can be uppercase`, () => {
    expect(isUuid(`7713E993-69D0-4611-ACDC-591BDE446D31`)).toBe(true);
});

each([ `not-a-uuid`, `cc70c032-ea3e-11eb-9a03-0242ac130003-plus-extra` ]).test(`%s isn't a valid UUID`, (candidate) => {
    expect(isUuid(candidate)).toBe(false);
});
