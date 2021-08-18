import { useGetOrganizationRoles } from "@/api/roles";
import { Role } from "@/types/graphQL";
import { FilterValueOption } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import {
    useEffect,
    useState,
} from "react";

export enum UserGenders {
    MALE = `male`,
    FEMALE = `female`,
    NOT_SPECIFIED = `not_specified`,
    OTHER = `other`,
}

export const useUserFilters = (orgId: string, skip?: boolean) => {
    const [ userRolesFilterValueOptions, setUserRolesFilterValueOptions ] = useState<FilterValueOption[]>([]);

    const { data: userRolesData } = useGetOrganizationRoles({
        variables: {
            organization_id: orgId ?? ``,
        },
        skip: !orgId || skip,
    });

    useEffect(() => {
        setUserRolesFilterValueOptions(mapUserRolesToFilterValueOptions(userRolesData?.organization?.roles ?? []));
    }, [ userRolesData ]);

    return {
        userRolesFilterValueOptions,
    };
};

export const mapUserRolesToFilterValueOptions = (roles: Role[]) => (
    roles.map(role => ({
        value: role.role_id ?? ``,
        label: role.role_name ?? ``,
    }))
);
