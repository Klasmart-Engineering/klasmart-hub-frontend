import { v4 as uuid } from "uuid";
const classId = uuid().substr(0, 5);

import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import CenterAlignChildren from "../../../components/centerAlignChildren";

import Container from "@material-ui/core/Container";
import Hidden from "@material-ui/core/Hidden";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import StyledButtonGroup from "../../../components/styled/buttonGroup";
import { FeaturedContentData } from "./contentLayout";

interface LessonPlanData {
    id: string;
    title: string;
    data?: any;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        ageBox: {
            border: "1px solid white",
            margin: theme.spacing(0, 1),
            overflow: "hidden",
            padding: theme.spacing(0, 1),
            textOverflow: "ellipsis",
        },
        contentInfo: {
            borderRadius: 12,
            color: "white",
            height: 350,
            paddingBottom: theme.spacing(3),
            // paddingLeft:  theme.spacing(5),
            paddingTop: theme.spacing(3),
            zIndex: 10,
            [theme.breakpoints.down("md")]: {
                backgroundImage: "linear-gradient(to bottom, #030D1C, rgba(3, 13, 28, 0.8), transparent)",
                color: "white",
                height: 600,
            },
            [theme.breakpoints.down("xs")]: {
                height: 600,
            },
        },
        headerView: {
            backgroundPosition: "center 60%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: 12,
            height: 350,
            [theme.breakpoints.down("md")]: {
                height: "100%",
                minHeight: 600,
            },
        },
        headerWebBackground: {
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: 12,
            boxShadow: "inset 20px 0px 2em 1em #030D1C",
        },
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
            marginRight: theme.spacing(2),
        },
        liveTextWrapper: {
            backgroundColor: "#ff6961",
            borderRadius: 20,
            color: "white",
            fontSize: "0.6em",
            padding: theme.spacing(0.25, 0.75),
        },
        select: {
            display: "block",
        },
    }),
);

interface Props {
    featuredContent: FeaturedContentData;
}

export default function ContentCard(props: Props) {
    const { featuredContent } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

    // function goLive() {
    //     const liveLink = `https://live.kidsloop.net/class-live/?token=${liveToken}`;

    //     window.open(liveLink, "_blank");
    // }

    function destinationLink(live: boolean, link?: string) {
        const liveLink = `https://live.kidsloop.net/live/?teacher&roomId=${classId}&materials=${JSON.stringify(featuredContent.activities)}`;

        window.open(live ? liveLink : link, "_blank");
    }

    return (
        <Grid
            alignItems={ isMdDown ? "flex-start" : "center" }
            container
            className={classes.headerView}
            direction="row"
            justify="space-between"
            style={{
                backgroundColor: isMdDown ? "linear-gradient( rgba(3, 13, 28, 0.4), rgba(3, 13, 28, 0.4) )" : "#030D1C",
                backgroundImage: isMdDown ? `url(${featuredContent.images.bannerMobile})` : "",
            }}
        >
            <Grid item xs={12} lg={4} className={classes.contentInfo}>
                <Container>
                    <Grid
                        container
                        direction="column"
                        justify={ isMdDown ? "flex-start" : "space-between" }
                        alignItems="flex-start"
                        wrap="nowrap"
                        style={{ minHeight: "100%" }}
                        spacing={ isMdDown ? 4 : 2 }
                    >
                        <Grid item>
                            <CenterAlignChildren>
                                <img src={featuredContent.images.logo} style={{ marginRight: theme.spacing(1), maxHeight: isMdDown ? 64 : "5vw" }}/>
                                <Typography variant="h5">
                                    {featuredContent.metadata.title}
                                </Typography>
                            </CenterAlignChildren>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">
                                <b>
                                    {featuredContent.metadata.year}
                                    <span className={classes.ageBox}>Ages {featuredContent.metadata.age}</span>
                                    Interactive
                                </b>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">
                                {featuredContent.metadata.description}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <StyledButtonGroup
                                ariaLabel="content mode buttons"
                                options={[{
                                    action: () => destinationLink(false, featuredContent.link),
                                    disabled: featuredContent.buttonGroupOptions[0],
                                    label: "Classroom Mode",
                                }, {
                                    action: () => destinationLink(true),
                                    disabled: featuredContent.buttonGroupOptions[1],
                                    label: "Go Live",
                                }]}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
            <Hidden mdDown>
                <Grid
                    item
                    xs={12} lg={8}
                    className={classes.headerWebBackground}
                    style={{ backgroundImage: `url(${featuredContent.images.bannerWeb})` }}
                >
                    <div style={{ height: 350, width: "100%" }} />
                </Grid>
            </Hidden>
        </Grid>
    );
}
