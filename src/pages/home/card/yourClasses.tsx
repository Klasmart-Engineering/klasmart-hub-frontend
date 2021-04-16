import { useGetMyClasses } from "@/api/classes";
import { Class } from "@/types/graphQL";
import {
    Box,
    Grid,
    Paper,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import { uniqBy } from "lodash";
import React,
{
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperContainer: {
            borderRadius: 12,
            border: `1px solid ${theme.palette.grey[300]}`,
            boxShadow:
                theme.palette.type === `dark`
                    ? `0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)`
                    : `0px 4px 8px 0px rgba(0, 0, 0, 0.1)`,
            padding: theme.spacing(2, 4),
        },
        rowTitle: {
            textTransform: `uppercase`,
            fontWeight: `bold`,
            padding: theme.spacing(2, 4),
        },
        blocTitle: {
            fontWeight: `bold`,
        },
        blocSubTitle: {
            color: theme.palette.grey[500],
            fontSize: `0.8em`,
            marginBottom: theme.spacing(1),
        },
        cardNoResult: {
            padding: theme.spacing(2, 4),
            margin: theme.spacing(2, 4),
            borderRadius: 12,
            backgroundColor: theme.palette.primary.light,
        },
    }));

export default function YourClasses () {
    const classes = useStyles();
    const theme = useTheme();
    const [ userClasses, setUserClasses ] = useState<Class[]>();

    const {
        data: dataClasses,
        refetch,
        loading,
    } = useGetMyClasses();

    useEffect(() => {
        if (dataClasses) {
            const classes: {
                user_id: string;
                full_name: string;
                classesStudying: Class[];
                classesTeaching: Class[];
            } = dataClasses.me;
            const userClassesStudying = classes.classesStudying;
            const userClassesTeaching = classes.classesTeaching;

            setUserClasses(uniqBy(userClassesStudying.concat(userClassesTeaching), (userClass) => userClass.class_id));
        }
    }, [ dataClasses ]);

    return (
        <Box>
            <Typography className={classes.rowTitle}>
                <FormattedMessage id="yourClasses_title" />
            </Typography>
            <Box>
                <Grid
                    container
                    spacing={4}>
                    {userClasses && userClasses.length !== 0 ? (
                        userClasses?.map((userClass) => (
                            <Grid
                                key={userClass.class_id}
                                item
                                xs={6}
                                lg={3}>
                                <Card>
                                    <Box>
                                        <Typography className={classes.blocSubTitle}>
                                            {userClass.schools?.map((school) => school.school_name).join(`, `)}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            className={classes.blocTitle}>
                                            {userClass.class_name}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid
                            item
                            xs
                            className={classes.cardNoResult}>
                            <Typography variant="body2">
                                <FormattedMessage id="yourClasses_noClass" />
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}

function Card ({ children }: { children: React.ReactNode }) {
    const classes = useStyles();

    return <Paper className={classes.paperContainer}>{children}</Paper>;
}
