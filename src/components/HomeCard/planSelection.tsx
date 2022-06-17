import { useRestAPI } from "@/api/restapi";
import InviteButton from "@/components/invite";
import StyledFAB from "@/components/styled/fabButton";
import { getLiveEndpoint } from "@/config";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { PublishedContentItem } from "@/types/objectTypes";
import { usePermission } from "@/utils/permissions";
import { Button } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { Share as ShareIcon } from "@styled-icons/material/Share";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => createStyles({
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
    input: {
        top: `auto`,
        bottom: `70%`,
        paddingRight: 22,
    },
}));

export default function PlanSelection () {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const restApi = useRestAPI();
    const intl = useIntl();

    const [ lessonPlan, setLessonPlan ] = useState<PublishedContentItem | null>(null);
    const [ lessonPlans, setLessonPlans ] = useState<PublishedContentItem[]>([]);
    const [ liveToken, setLiveToken ] = useState(``);
    const [ shareLink, setShareLink ] = useState(``);
    const [ openShareLink, setOpenShareLink ] = useState(false);
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;

    const permissionAccessLibrary = usePermission(`library_200`);

    async function getPublishedLessonPlans () {
        try {
            const response = await restApi.getContentsFolders(organizationId);
            setLessonPlans(response);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (!currentOrganization?.id) return;
        getPublishedLessonPlans();
    }, [ currentOrganization?.id ]);

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
            const json = await restApi.getLiveTokenByLessonPlanId({
                lessonPlanId: lessonPlan.id,
                organizationId,
            });
            if (prepared) {
                if (json && json.token) {
                    setLiveToken(json.token);

                    /*
                    NOTE : Share room is not supported anymore
                    const token: LivePreviewJWT = jwtDecode(json.token);
                    console.log(token);
                    setShareLink(token?.roomid);*/
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
                    justifyContent="space-between"
                    alignItems="center"
                    className={classes.cardHead}
                >
                    <Grid item>
                        <Typography className={classes.cardTitle}>
                            <FormattedMessage id="planSelection_title" />
                        </Typography>
                    </Grid>
                    {permissionAccessLibrary && (
                        <Grid item>
                            <Button
                                color="primary"
                                variant="contained"
                                className={classes.cardButton}
                                onClick={(e: React.MouseEvent) => {
                                    navigate(`/library`);
                                    e.preventDefault();
                                }}
                            >
                                {intl.formatMessage({
                                    id: `planSelection_viewLibraryLabel`,
                                })}
                            </Button>
                        </Grid>
                    )}
                </Grid>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    className={classes.cardBody}
                >
                    <Grid
                        item
                        xs
                    >
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
                            <>
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

                                <Collapse in={openShareLink}>
                                    <InviteButton url={`${getLiveEndpoint()}?roomId=${shareLink}`} />
                                </Collapse>
                            </>
                        )}
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
    lessonPlans: PublishedContentItem[];
    lessonPlan?: PublishedContentItem | null;
    setLessonPlan: React.Dispatch<
        React.SetStateAction<PublishedContentItem | null>
    >;
}) {
    const [ inputValue, setInputValue ] = useState(``);
    const intl = useIntl();
    const classes = useStyles();

    return (
        <Autocomplete
            fullWidth
            autoHighlight
            id="lesson-plan-select"
            disabled={!lessonPlans.length}
            options={lessonPlans}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
                <li {...props}>
                    {option.name}
                </li>
            )}
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
                    InputLabelProps={{
                        className: classes.input,
                    }}
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
