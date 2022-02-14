import NoDataSvg from "@/assets/img/nodata.svg";
import { Theme } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import { makeStyles } from "@mui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme:Theme) => createStyles({
    container: {
        display: `flex`,
        flexDirection: `column`,
        width: `100%`,
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    image:{
        width: `30%`,
    },
    message: {
        color: theme.palette.primary.main,
        fontSize: 24,
        fontWeight: `bold`,
        textAlign: `center`,
    },
}));

export default function WidgetWrapperNoData () {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <img
                src={NoDataSvg}
                alt=""
                className={classes.image}
            />
            <div className={classes.message}>
                <FormattedMessage
                    id="home.common.noData.generic.title"
                />
            </div>
        </div>
    );
}
