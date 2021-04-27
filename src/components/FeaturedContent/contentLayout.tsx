import ContentCard from "./contentCard";
import GeniusBannerMobile from "@/assets/img/bgf/bgf_banner_mobile.jpg";
import GeniusBannerWeb from "@/assets/img/bgf/bgf_banner_web.jpg";
import GeniusLogo from "@/assets/img/bgf/logo_badanamu_genius.png";
import ZooLogo from "@/assets/img/zoo/logo_badanamu_zoo.png";
import ZooBannerMobile from "@/assets/img/zoo/zoo_banner_mobile.png";
import ZooBannerWeb from "@/assets/img/zoo/zoo_banner_web.png";
import { useMediaQuery } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {
    createStyles,
    makeStyles,
    useTheme,
} from "@material-ui/core/styles";
import React,
{ useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const DEMO_LESSON_MATERIALS = [
    {
        name: `Introduction`,
        url: `/h5p/play/5ed99fe36aad833ac89a4803`,
    },
    {
        name: `Sticker Activity`,
        url: `/h5p/play/5ed0b64a611e18398f7380fb`,
    },
    {
        name: `Hotspot Cat Family 1`,
        url: `/h5p/play/5ecf6f43611e18398f7380f0`,
    },
    {
        name: `Hotspot Cat Family 2`,
        url: `/h5p/play/5ed0a79d611e18398f7380f7`,
    },
    {
        name: `Snow Leopard Camouflage 1`,
        url: `/h5p/play/5ecf71d2611e18398f7380f2`,
    },
    {
        name: `Snow Leopard Camouflage 2`,
        url: `/h5p/play/5ed0a79d611e18398f7380f7`,
    },
    {
        name: `Snow Leopard Camouflage 3`,
        url: `/h5p/play/5ed0a7d6611e18398f7380f8`,
    },
    {
        name: `Snow Leopard Camouflage 4`,
        url: `/h5p/play/5ed0a7f8611e18398f7380f9`,
    },
    {
        name: `Snow Leopard Camouflage 5`,
        url: `/h5p/play/5ed0a823611e18398f7380fa`,
    },
    {
        name: `Matching`,
        url: `/h5p/play/5ecf4e4b611e18398f7380ef`,
    },
    {
        name: `Quiz`,
        url: `/h5p/play/5ed07656611e18398f7380f6`,
    },
];
export interface FeaturedContentData {
    activities: Array<{ name: string; url: string }>;
    buttonGroupOptions: [boolean, boolean];
    images: {
        bannerMobile: string;
        bannerWeb: string;
        logo: string;
    };
    link: string;
    metadata: {
        age: string;
        description: string;
        title: string;
        year: number;
    };
}

const FEATURED_CONTENT: FeaturedContentData[] = [
    {
        activities: DEMO_LESSON_MATERIALS,
        buttonGroupOptions: [ false, false ],
        images: {
            bannerMobile: ZooBannerMobile,
            bannerWeb: ZooBannerWeb,
            logo: ZooLogo,
        },
        link: `https://zoo.kidsloop.net`,
        metadata: {
            age: `4-7+`,
            description: `In collaboration with The Zoological Society of East Anglia, join an interactive virtual world of animal fun and learning through live and self-paced classes.`,
            title: `Snow Leopard`,
            year: 2020,
        },
    },
    {
        activities: DEMO_LESSON_MATERIALS,
        buttonGroupOptions: [ true, true ],
        images: {
            bannerMobile: GeniusBannerMobile,
            bannerWeb: GeniusBannerWeb,
            logo: GeniusLogo,
        },
        link: ``,
        metadata: {
            age: `3-5+`,
            description: `Build integral foundational skills and learn English with this core educational program from Badanamu. Learn colors, shapes, numbers, and phonics along with associated vocabulary.`,
            title: `Foundation 1`,
            year: 2020,
        },
    },
];

const useStyles = makeStyles((theme) => createStyles({
    liveButton: {
        backgroundColor: `#ff6961`,
        color: `white`,
    },
    liveTextWrapper: {
        backgroundColor: `#ff6961`,
        borderRadius: 20,
        color: `white`,
        fontSize: `0.6em`,
        padding: theme.spacing(0.25, 0.75),
    },
    paperContainer: {
        borderRadius: 12,
        boxShadow: theme.palette.type === `dark` ? `0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)` : `0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)`,
    },
    root: {
        height: `100%`,
    },
}));

interface Props {
}

export default function ContentLayout (props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const [ activeStep, setActiveStep ] = useState(0);
    const [ autoplay, setAutoplay ] = useState(true);

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <Grid
            item
            xs={12}
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
        >
            <AutoPlaySwipeableViews
                enableMouseEvents
                axis={`x`}
                index={activeStep}
                containerStyle={{
                    width: isSmDown ? `100%` : (isMdDown ? `50%` : `100%`),
                }}
                onChangeIndex={(activeStep) => autoplay && handleStepChange(activeStep)}
            >
                {FEATURED_CONTENT.map((content) => (
                    <Paper
                        key={content.metadata.title}
                        elevation={4}
                        className={classes.paperContainer}>
                        <ContentCard featuredContent={content} />
                    </Paper>
                ))}
            </AutoPlaySwipeableViews>
        </Grid>
    );
}
