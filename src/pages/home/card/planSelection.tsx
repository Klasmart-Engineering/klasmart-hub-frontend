import { useRestAPI } from "@/api/restapi";
import { currentMembershipVar } from "@/cache";
import InviteButton from "@/components/invite";
import StyledFAB from "@/components/styled/fabButton";
import {
    getCNEndpoint,
    getLiveEndpoint,
} from "@/config";
import {
    LivePreviewJWT,
    PublishedContentItem,
    SchedulePayload,
} from "@/types/objectTypes";
import { history } from "@/utils/history";
import { useReactiveVar } from "@apollo/client/react";
import { Button } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Share as ShareIcon } from "@styled-icons/material/Share";
import jwtDecode from "jwt-decode";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardHead: {
            padding: theme.spacing(1, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(1, 2),
            },
            borderBottom: `1px solid #e0e0e0`,
        },
        cardTitle: {
            textTransform: `uppercase`,
            fontWeight: `bold`,
        },
        cardBody: {
            padding: theme.spacing(2, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
        },
        cardButton: {
            background: `transparent`,
            color: theme.palette.primary.main,
            boxShadow: `none`,
            "&:hover, &:active": {
                backgroundColor: `#f3f3f3`,
                boxShadow: `none`,
            },
        },
        infoCard: {
            borderRadius: 12,
            padding: theme.spacing(0, 2),
        },
        liveButton: {
            backgroundColor: `#ff6961`,
            color: `white`,
            marginLeft: theme.spacing(1),
        },
        liveText: {
            backgroundColor: `#eda6c5`,
            borderRadius: 12,
            color: `white`,
            fontWeight: 600,
            padding: theme.spacing(0, 1),
        },
        logo: {
            marginBottom: theme.spacing(0.5),
        },
        select: {
            display: `block`,
        },
    }));

export default function PlanSelection () {
    const classes = useStyles();
    const theme = useTheme();
    const restApi = useRestAPI();
    const intl = useIntl();

    const [ lessonPlan, setLessonPlan ] = useState<PublishedContentItem | null>(null);
    const [ lessonPlans, setLessonPlans ] = useState<
    PublishedContentItem[] | undefined
  >(undefined);
    const [ liveToken, setLiveToken ] = useState(``);
    const [ shareLink, setShareLink ] = useState(``);
    const [ openShareLink, setOpenShareLink ] = useState(false);

    const currentOrganization = useReactiveVar(currentMembershipVar);

    async function getPublishedLessonPlans () {
        try {
            const response = await restApi.getContentsFolders(currentOrganization.organization_id);
            console.log(response);
            setLessonPlans(response);
        } catch (e) {
            console.error(e);
        }
    }

    async function getLiveToken (lessonPlanId: string) {
        const headers = new Headers();
        headers.append(`Accept`, `application/json`);
        headers.append(`Content-Type`, `application/json`);
        const response = await fetch(`${getCNEndpoint()}v1/contents/${lessonPlanId}/live/token?org_id=${
            currentOrganization.organization_id
        }`, {
            headers,
            credentials: `include`,
            method: `GET`,
        });
        if (response.status === 200) {
            return response.json();
        }
    }

    useEffect(() => {
        if (currentOrganization.organization_id !== ``) {
            getPublishedLessonPlans();
        }
    }, [ currentOrganization ]);

    useEffect(() => {
        if (!lessonPlan) {
            setLiveToken(``);
            setShareLink(``);
            return;
        }
        if (lessonPlan.id === ``) {
            return;
        }
        let prepared = true;
        (async () => {
            const json = await getLiveToken(lessonPlan.id);
            if (prepared) {
                if (json && json.token) {
                    setLiveToken(json.token);

                    const token: LivePreviewJWT = jwtDecode(json.token);
                    console.log(token);
                    setShareLink(token?.roomid);
                } else {
                    setLiveToken(``);
                }
            }
        })();
        return () => {
            prepared = false;
        };
    }, [ lessonPlan ]);

    function goLive () {
        const liveLink = `${getLiveEndpoint()}?token=${liveToken}`;
        window.open(liveLink);
    }

    return (
        <>
            <Grid container>
                <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.cardHead}
                >
                    <Grid item>
                        <Typography className={classes.cardTitle}>
                            <FormattedMessage id="planSelection_title" />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            className={classes.cardButton}
                            onClick={(e: React.MouseEvent) => {
                                history.push(`/library`);
                                e.preventDefault();
                            }}
                        >
                            {intl.formatMessage({
                                id: `planSelection_viewLibraryLabel`,
                            })}
                        </Button>
                    </Grid>
                </Grid>
                <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.cardBody}
                >
                    <Grid
                        item
                        xs>
                        <LessonPlanSelect
                            lessonPlans={lessonPlans}
                            lessonPlan={lessonPlan}
                            setLessonPlan={setLessonPlan}
                        />
                    </Grid>
                    <Grid item>
                        <StyledFAB
                            extendedOnly
                            flat
                            disabled={liveToken === ``}
                            className={classes.liveButton}
                            size="medium"
                            onClick={() => goLive()}
                        >
                            <FormattedMessage id="live_liveButton" />
                        </StyledFAB>
                        {shareLink !== `` && (
                            <StyledFAB
                                flat
                                style={{
                                    marginLeft: theme.spacing(1),
                                    minWidth: 0,
                                }}
                                size="small"
                                onClick={() => setOpenShareLink(!openShareLink)}
                            >
                                <ShareIcon size="1rem" />
                            </StyledFAB>
                        )}

                        <Collapse in={openShareLink}>
                            <InviteButton url={`${getLiveEndpoint()}?roomId=${shareLink}`} />
                        </Collapse>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

function LessonPlanSelect ({
    lessonPlans,
    lessonPlan,
    setLessonPlan,
}: {
  lessonPlans?: PublishedContentItem[];
  lessonPlan?: PublishedContentItem | null;
  setLessonPlan: React.Dispatch<
    React.SetStateAction<PublishedContentItem | null>
  >;
}) {
    const [ inputValue, setInputValue ] = useState(``);
    const intl = useIntl();

    return (
        <Autocomplete
            fullWidth
            autoHighlight
            id="lesson-plan-select"
            disabled={!lessonPlans}
            options={lessonPlans as PublishedContentItem[]}
            getOptionLabel={(option) => option.name}
            renderOption={(option) => <React.Fragment>{option.name}</React.Fragment>}
            value={lessonPlan}
            noOptionsText={intl.formatMessage({
                id: `planSelection_noOptionsLabel`,
            })}
            inputValue={inputValue}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={
                        lessonPlans
                            ? intl.formatMessage({
                                id: `planSelection_selectPlanLabel`,
                            })
                            : intl.formatMessage({
                                id: `planSelection_planNotAvailableLabel`,
                            })
                    }
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: `new-password`, // disable autocomplete and autofill
                    }}
                />
            )}
            onChange={(event: any, newValue: PublishedContentItem | null) => {
                setLessonPlan(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
        />
    );
}
