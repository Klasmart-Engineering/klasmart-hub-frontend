import { useQuery } from "@apollo/client";
import { CHECK_ALLOWED } from "../operations/queries/checkAllowedPermission";

export const checkAllowed = (
    organization_id: string,
    permission_name: string,
) => {
    const { data } = useQuery(CHECK_ALLOWED, {
        fetchPolicy: "network-only",
        variables: { organization_id, permission_name },
    });

    return data;
};
