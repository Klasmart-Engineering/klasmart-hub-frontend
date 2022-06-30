import { getCmsSiteEndpoint } from "@/config";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { TabTitle } from "@/utils/tabTitle";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
        height: `calc(100% - ${theme.spacing(6)})`,
    },
}));

interface Props {
}

export default function MoreFeaturedContentPage (props: Props) {
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    TabTitle(`Kidsloop | Interactive Digital Platform for Education | Content Library | More Featured Content`);

    return (
        <iframe
            src={`${getCmsSiteEndpoint()}?org_id=${organizationId}#/library/my-content-list?program_group=More Featured Content&order_by=-update_at&page=1`}
            frameBorder="0"
            className={classes.root}
        />
    );
}
