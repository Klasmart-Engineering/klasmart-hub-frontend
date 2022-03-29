import { Theme } from "@mui/material";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import React from 'react';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(3),
        flex: 1,
        display: `flex`,
        flexDirection: `column`,
    },
    description: {
        fontWeight: 400,
    },
    imageContainer: {
        flex: 5,
        display: `grid`,
        placeContent: `center`,
        background: `#f2f3f8`,
        padding: theme.spacing(2),
        minHeight: 280,
    },
    descriptionContainer: {
        flex: 3,
        display: `grid`,
        placeContent: `center`,
        minHeight: 100,
    },
    image: {
        width: 320,
        height: `auto`,
        background: `#ffffff`,
    },
}));
interface Props {
    selectedWidget: any;
}
export default function WidgetPreview (props: Props) {
    const { selectedWidget } = props;
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <div className={classes.imageContainer}>
                {selectedWidget ?
                    <img
                        className={classes.image}
                        src={selectedWidget.snapshotUrl} />
                    : `All wigets have been added`}
            </div>
            <div className={classes.descriptionContainer}>
                <Typography className={classes.description}>
                    {selectedWidget.description}
                </Typography>
            </div>

        </Box>
    );
}
