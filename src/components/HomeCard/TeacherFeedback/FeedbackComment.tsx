import { TeacherFeedbackRow } from "./Table";
import globalStyles from "@/globalStyles";
import {
    createStyles,
    Link,
    makeStyles,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const lineTruncAt = 2;
const lineHeight = 20;

const useStyles = makeStyles((theme) => {
    const { clickable } = globalStyles(theme);
    return createStyles({
        clickable,
        feedbackText: {
            display: `inline-block`,
        },
        feedbackShort: {
            display: `-webkit-inline-box`,
            boxOrient: `vertical`,
            overflow: `hidden`,
            textOverflow: `ellipsis`,
            cursor: `pointer`,
            verticalAlign: `bottom`,
            lineHeight: `${lineHeight}px`,
        },
        feedbackTruncated: {
            lineClamp: lineTruncAt,
        },
        feedbackResizing: {
            opacity: 0,
        },
    });
});

const checkTruncateRequired = (id: string): boolean => {
    const elem = document.getElementById(id);
    const height = elem?.offsetHeight;

    return (height ?? 0) > lineHeight * lineTruncAt;
};

interface Props {
    id: string;
    feedback: string;
    handleMoreFeedbackOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void;
}

export default function FeedbackComment (props: Props) {
    const classes = useStyles();
    const {
        handleMoreFeedbackOpen,
        id,
        feedback,
    } = props;
    const intl = useIntl();
    const [ truncateRequired, setTruncateRequired ] = useState(false);
    const [ isResizing, setIsResizing ] = useState(false);
    const componentId = `showMore-${id}`;

    useEffect(() => {
        setTruncateRequired(checkTruncateRequired(componentId));
    }, [ id ]);

    useEffect(() => {
        let debouncer: ReturnType<typeof setTimeout>;
        const resizeEventListener = () => {
            setIsResizing(true);
            setTruncateRequired(false);
            clearTimeout(debouncer);

            debouncer = setTimeout(() => {
                setTruncateRequired(checkTruncateRequired(componentId));
                setIsResizing(false);
            }, 5);
        };

        window.addEventListener(`resize`, resizeEventListener);

        return () => {
            window.removeEventListener(`resize`, resizeEventListener);
        };
    }, []);

    return (
        <Typography
            variant="body2"
            className={clsx(classes.clickable, classes.feedbackText)}
            onClick={(event) => handleMoreFeedbackOpen(event, id)}
        >
            <div
                className={clsx(classes.feedbackShort, {
                    [classes.feedbackTruncated]: truncateRequired,
                    [classes.feedbackResizing]: isResizing,
                })}
                id={componentId}
            >
                {feedback}
            </div>

            {truncateRequired &&
                <Link href={undefined}>
                    {` ... ${intl.formatMessage({
                        id: `teacherFeedback.column.feedback.showMore`,
                    })}`}
                </Link>
            }
        </Typography>
    );
}
