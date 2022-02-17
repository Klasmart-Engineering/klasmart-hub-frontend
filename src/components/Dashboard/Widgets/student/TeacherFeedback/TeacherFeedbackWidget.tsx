import alex from "@/assets/img/teacher_alex.png";
import christina from "@/assets/img/teacher_christina.png";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import {
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import React from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme:Theme) => createStyles({
    widgetContent: {
        height: `100%`,
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `space-around`,
    },
    feedbackOuterWrapper: {
        display: `flex`,
        flexDirection: `row`,
        flexGrow: 1,
    },
    feedbackInnerWrapper: {
        width: `90%`,
        display: `flex`,
        flexDirection: `column`,
        marginLeft: 20,
    },
    feedbackHeader: {
        display: `flex`,
        flexDirection: `row`,
        justifyContent: `space-between`,
    },
    iconWrapper: {
        width: `10%`,
        [theme.breakpoints.down(`sm`)]: {
            display: `none`,
        },
    },
    name: {
        fontSize: 14,
    },
    date: {
        fontSize: 12,
        color: theme.palette.grey[600],
    },
    feedback: {
        backgroundColor: `#FFBC00`,
        borderRadius: `10px 20px 20px 20px`,
        opacity: `0.8`,
        fontSize: 14,
        padding: 15,
    },
    icon: {
        height: 60,
        width: 60,
        borderRadius: `50%`,
        display: `flex`,
    },
}));

export default function TreacherFeedbackWidget () {
    const intl = useIntl();
    const classes = useStyles();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const formatDate = (date: Date) => {
        const month = date.toLocaleString(`default`, {
            month: `short`,
        });
        const day = date.getDate();
        const time = date.toLocaleString(`default`, {
            hour: `numeric`,
            hour12: true,
        });
        const feedbackTime = day === new Date().getDate() - 1 ?
            <FormattedMessage id="home.student.teacherFeedbackWidget.yesterday" />
            : day === new Date().getDate() ?
                <FormattedMessage id="home.student.teacherFeedbackWidget.today" />
                :
                `${month} ${day}`;

        return `${time}, ${feedbackTime}`;
    };

    const data = [
        {
            teacher: `Alex`,
            date: yesterday,
            class: <FormattedMessage id="home.student.teacherFeedbackWidget.butterflyClass" />,
            feedback: <FormattedMessage id="home.student.teacherFeedbackWidget.alexFeedback" />,
            image: alex,
        },
        {
            teacher: `Christina`,
            date: twoDaysAgo,
            class: <FormattedMessage id="home.student.teacherFeedbackWidget.butterflyClass" />,
            feedback: <FormattedMessage id="home.student.teacherFeedbackWidget.christinaFeedback" />,
            image: christina,
        },
    ];

    return (
        <WidgetWrapper
            loading={false}
            error={false}
            noData={false}
            reload={() => {false;}}
            label={
                intl.formatMessage({
                    id: `home.student.teacherFeedbackWidget.containerTitleLabel`,
                })
            }
            link={{
                url: `feedback`,
                label: intl.formatMessage({
                    id: `home.student.teacherFeedbackWidget.containerUrlLabel`,
                }),
            }}
            id={WidgetType.FEEDBACK}>
            <div className={classes.widgetContent}>
                {data.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={classes.feedbackOuterWrapper}>
                            <div className={classes.iconWrapper}>
                                <div className={classes.icon}>
                                    <img src={item.image}/>
                                </div>
                            </div>
                            <div className={classes.feedbackInnerWrapper}>
                                <div className={classes.feedbackHeader}>
                                    <Typography className={classes.name}><b>{item.teacher}</b>, {item.class}</Typography>
                                    <Typography className={classes.date}>{formatDate(item.date)}</Typography>
                                </div>
                                <Typography className={classes.feedback}>{item.feedback}</Typography>
                            </div>
                        </div>
                    );
                })}
            </div>
        </WidgetWrapper>
    );
}
