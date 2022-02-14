import ChromeLogo from "../assets/img/browsers/logo-chrome.png";
import EdgeLogo from "../assets/img/browsers/logo-edge.png";
import FireFoxLogo from "../assets/img/browsers/logo-firefox.png";
import OperaLogo from "../assets/img/browsers/logo-opera.png";
import SafariLogo from "../assets/img/browsers/logo-safari.png";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import * as React from "react";

const useStyles = makeStyles((theme) => createStyles({
    card: {
        padding: `48px 40px !important`,
    },
    browserLogo: {
        verticalAlign: `middle`,
        display: `table-cell`,
        width: 52,
    },
    textLogo: {
        verticalAlign: `middle`,
        display: `table-cell`,
        textDecoration: `none`,
        paddingLeft: 12,
    },
}));

function detectIE () {
    const ua = window.navigator.userAgent;
    // Test values; Uncomment to check result …
    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
    const msie = ua.indexOf(`MSIE `);
    if (msie > 0) { return parseInt(ua.substring(msie + 5, ua.indexOf(`.`, msie)), 10); }
    const trident = ua.indexOf(`Trident/`);
    if (trident > 0) {
        const rv = ua.indexOf(`rv:`);
        return parseInt(ua.substring(rv + 3, ua.indexOf(`.`, rv)), 10);
    }
    const edge = ua.indexOf(`Edge/`);
    if (edge > 0) { return parseInt(ua.substring(edge + 5, ua.indexOf(`.`, edge)), 10); }
    // other browser
    return false;
}

export function BrowserList () {
    const classes = useStyles();
    const isIE = detectIE();

    return (
        <Card>
            <CardContent className={classes.card}>
                <Typography
                    gutterBottom
                    variant="h4"
                    color="textSecondary">
                    Browser not supported
                </Typography>
                <Typography color="textSecondary">
                    We apologize for any inconvenience. We recommend using this site with one of the following browsers:
                </Typography>
                <Grid
                    container
                    spacing={4}
                    style={{
                        padding: `16px 0`,
                    }}>
                    <Grid
                        item
                        xs={4}
                        style={{
                            width: `33%`,
                            display: `table`,
                        }}>
                        <a
                            href="https://www.google.com/chrome/"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.browserLogo}>
                            <img
                                src={ChromeLogo}
                                style={{
                                    height: 48,
                                }} />
                        </a>
                        <a
                            href="https://www.google.com/chrome/"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.textLogo}>
                            <Typography variant="caption">
                                Google Chrome
                            </Typography>
                        </a>
                    </Grid>

                    <Grid
                        item
                        xs={4}
                        style={{
                            width: `33%`,
                            display: `table`,
                        }}>
                        <a
                            href="http://www.firefox.com"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.browserLogo}>
                            <img
                                src={FireFoxLogo}
                                style={{
                                    height: 48,
                                }} />
                        </a>
                        <a
                            href="http://www.firefox.com"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.textLogo}>
                            <Typography variant="caption">
                                Mozilla FireFox
                            </Typography>
                        </a>
                    </Grid>

                    <Grid
                        item
                        xs={4}
                        style={{
                            width: `33%`,
                            display: `table`,
                        }}>
                        <a
                            href="http://www.opera.com"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.browserLogo}>
                            <img
                                src={OperaLogo}
                                style={{
                                    height: 48,
                                }} />
                        </a>
                        <a
                            href="http://www.opera.com"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.textLogo}>
                            <Typography variant="caption">
                                Opera
                            </Typography>
                        </a>
                    </Grid>
                </Grid>
                <Typography color="textSecondary">
                    We also support:
                </Typography>
                <Grid
                    container
                    spacing={4}
                    style={{
                        padding: `16px 0`,
                    }}>
                    <Grid
                        item
                        xs={4}
                        style={{
                            width: `33%`,
                            display: `table`,
                        }}>
                        <a
                            href="https://www.microsoft.com/en-us/windows/microsoft-edge"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.browserLogo}>
                            <img
                                src={EdgeLogo}
                                style={{
                                    height: 48,
                                }} />
                        </a>
                        <a
                            href="https://www.microsoft.com/en-us/windows/microsoft-edge"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.textLogo}>
                            <Typography variant="caption">
                                Microsoft Edge
                            </Typography>
                        </a>
                    </Grid>

                    <Grid
                        item
                        xs={4}
                        style={{
                            width: `33%`,
                            display: `table`,
                        }}>
                        <a
                            href="https://support.apple.com/downloads/#safari"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.browserLogo}>
                            <img
                                src={SafariLogo}
                                style={{
                                    height: 48,
                                }} />
                        </a>
                        <a
                            href="https://support.apple.com/downloads/#safari"
                            target="_blank"
                            rel="noreferrer"
                            className={classes.textLogo}>
                            <Typography variant="caption">
                                Safari (macOS 10.8+ only)
                            </Typography>
                        </a>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
