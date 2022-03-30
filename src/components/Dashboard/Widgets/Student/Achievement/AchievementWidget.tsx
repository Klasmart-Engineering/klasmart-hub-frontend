
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import ProgressBar from "@/components/Dashboard/Widgets/PendingAssessments/ProgressBar";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { useStudentLearningOutcome } from "@kl-engineering/reports-api-client";
import { FiberManualRecord } from "@mui/icons-material";
import {
    List,
    ListItem,
    Theme,
    Typography,
    useTheme,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { sumBy } from "lodash";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    widgetContent: {
        height: `100%`,
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `space-evenly`,
    },
    row: {
        display: `grid`,
        gridTemplateColumns: `25% 60% 10% `,
        gridTemplateRows: `1fr`,
        gridColumnGap: theme.spacing(1.25),
        alignItems: `center`,
        width: `100%`,
        marginBottom: theme.spacing(1.25),
    },
    rowIcon: {
        color: theme.palette.getContrastText(theme.palette.text.primary),
        borderRadius: `100%`,
        padding: 5,
        fontSize: 35,
    },
    text: {
        fontSize: 16,
        fontWeight: 600,
    },
    count: {
        fontSize: 24,
        fontWeight: 400,
        textAlign: `right`,
        marginRight: 10,
    },
    titleWrapper: {
        display: `flex`,
        alignItems: `center`,
    },
    title: {
        color: theme.palette.grey[600],
        fontSize: 12,
        marginLeft: 5,
        alignSelf: `flex-start`,
    },
    bullet: {
        color: theme.palette.info.light,
        fontSize: 10,
    },
    break: {
        border: `1px solid #B7B7B7`,
        width: `95%`,
        margin: `auto`,
    },
    heading: {
        textAlign: `center`,
        color: `#1896EA`,
        fontWeight: 600,
        fontSize: 14,
    },
}));

export interface AchievementData {
    intlKey: JSX.Element;
    count: number;
    color: string;
}

export default function AchievementWidget () {
    const intl = useIntl();
    const classes = useStyles();
    const theme = useTheme();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    const {
        data: achievementData,
        isFetching: isachievementDataFetching,
        error: isachievementDataError,
        refetch: achievementDataRefetch,
    } = useStudentLearningOutcome({
        org: organizationId,
    });
    const [ achievementDatas, setachievementDatas ] = useState<AchievementData[]>();
    const [ total, setTotal ] = useState(0);
    useEffect(() => {
        if (!achievementData || achievementData.info === undefined) return;
        const generatedAchievementData = [
            {
                intlKey: <FormattedMessage id="home.student.achievementWidget.legendAchieved" />,
                count: achievementData.info.learning_outcomes.achieved,
                color: theme.palette.info.light,
            },
            {
                intlKey: <FormattedMessage id="home.student.achievementWidget.legendPending" />,
                count: achievementData.info.learning_outcomes.not_covered,
                color: `#9473E5`,
            },
            {
                intlKey: <FormattedMessage id="home.student.achievementWidget.legendNotAchieved" />,
                count: achievementData.info.learning_outcomes.not_achieved,
                color: theme.palette.error.light,
            },
        ];
        setachievementDatas(generatedAchievementData);
        setTotal(sumBy(generatedAchievementData, (item) => item.count));

    }, [ achievementData, theme ]);
    const reload = () => {
        achievementDataRefetch();
    };

    return (
        <WidgetWrapper
            loading={isachievementDataFetching}
            error={isachievementDataError}
            noData={!achievementData?.successful}
            reload={reload}
            label={
                intl.formatMessage({
                    id: `home.student.achievementWidget.containerTitleLabel`,
                })
            }
            link={{
                url: `reports`,
                label: intl.formatMessage({
                    id: `home.student.achievementWidget.containerUrlLabel`,
                }),
            }}
            id={WidgetType.ACHIEVEMENT}
        >
            <div className={classes.widgetContent}>
                <div className={classes.titleWrapper}>
                    <FiberManualRecord className={classes.bullet} />
                    <Typography className={classes.title}>
                        <FormattedMessage id="home.student.achievementWidget.title" />
                    </Typography>
                </div>
                {achievementDatas &&
                    <List>
                        <Typography className={classes.heading}>
                            <FormattedMessage id="home.student.achievementWidget.containerHeading" />
                        </Typography>
                        <div className={classes.break} />
                        {achievementDatas?.map((item, index: number) => {
                            return (
                                <ListItem key={index}>
                                    <div
                                        className={classes.row}
                                        style={{
                                            color: item.color,
                                        }}
                                    >
                                        <div
                                            className={classes.text}
                                        >
                                            {item.intlKey}
                                        </div>
                                        <div>
                                            <ProgressBar
                                                total={total}
                                                progress={item.count}
                                                color={item.color}
                                                thickness={15}
                                                backgroundColor="transparent"
                                            />
                                        </div>
                                        <div
                                            className={classes.count}
                                        >
                                            {item.count}
                                        </div>
                                    </div>
                                </ListItem>);
                        })}
                        <div className={classes.break} />
                    </List>
                }
            </div>
        </WidgetWrapper>
    );
}
