import KidsloopLogo from "@/assets/img/kidsloop.svg";
import { tabTitle } from "@/utils/tabTitle";
import { Typography } from "@mui/material";
import { Theme } from '@mui/material/styles';
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {
            margin: `auto`,
            width: `80%`,
            maxWidth: 600,
            [theme.breakpoints.down(`sm`)]: {
                width: `100%`,
                padding: theme.spacing(3),
            },
        },
        container: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(6),
            display: `flex`,
            justifyContent: `space-between`,
        },
        header: {
            alignSelf: `center`,
        },
        kidsloopLogo: {
            height: `2.5rem`,
            [theme.breakpoints.down(`sm`)]: {
                height: `2rem`,
            },
        },
        content: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(4),
        },
    });
});

export default function GeneratedData () {
    const classes = useStyles();

    tabTitle(`User Deletion`);

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <Typography
                    variant="h4"
                    component="h2"
                    className={classes.header}
                >
                    <FormattedMessage
                        id="generatedData.userDeletion.label"
                    />
                </Typography>
                <img
                    className={classes.kidsloopLogo}
                    alt="KidsLoop Logo - Home"
                    src={KidsloopLogo}
                />
            </div>
            <Typography
                variant="body2"
                component="p"
                className={classes.content}
            >
                <FormattedMessage
                    id="generatedData.userDeletion.description"
                />
            </Typography>
            <Typography
                variant="h5"
                component="h2"
            >
                <FormattedMessage
                    id="generatedData.academicData.label"
                />
            </Typography>
            <Typography
                variant="body2"
                component="p"
                className={classes.content}
            >
                <FormattedMessage
                    id="generatedData.academicData.description"
                />
            </Typography>
            <Typography
                variant="h5"
                component="h2"
            >
                <FormattedMessage
                    id="generatedData.assessmentData.label"
                />
            </Typography>
            <Typography
                variant="body2"
                component="p"
                className={classes.content}
            >
                <FormattedMessage
                    id="generatedData.assessmentData.description"
                />
            </Typography>
            <Typography
                variant="h5"
                component="h2"
            >
                <FormattedMessage
                    id="generatedData.classes.label"
                />
            </Typography>
            <Typography
                variant="body2"
                component="p"
                className={classes.content}
            >
                <FormattedMessage
                    id="generatedData.classes.description"
                />
            </Typography>
            <Typography
                variant="h5"
                component="h2"
            >
                <FormattedMessage
                    id="generatedData.contentLibrary.label"
                />
            </Typography>
            <Typography
                variant="body2"
                component="p"
                className={classes.content}
            >
                <FormattedMessage
                    id="generatedData.contentLibrary.description"
                />
            </Typography>
            <Typography
                variant="h5"
                component="h2"
            >
                <FormattedMessage
                    id="generatedData.live.label"
                />
            </Typography>
            <Typography
                variant="body2"
                component="p"
                className={classes.content}
            >
                <FormattedMessage
                    id="generatedData.live.description"
                />
            </Typography>
            <Typography
                variant="h5"
                component="h2"
            >
                <FormattedMessage
                    id="generatedData.reportData.label"
                />
            </Typography>
            <Typography
                variant="body2"
                component="p"
                className={classes.content}
            >
                <FormattedMessage
                    id="generatedData.reportData.description"
                />
            </Typography>
            <Typography
                variant="h5"
                component="h2"
            >
                <FormattedMessage
                    id="generatedData.scheduleData.label"
                />
            </Typography>
            <Typography
                variant="body2"
                component="p"
                className={classes.content}
            >
                <FormattedMessage
                    id="generatedData.scheduleData.description"
                />
            </Typography>
        </div>
    );
}
