import { School } from "@/types/graphQL";
import { EntityStepContent } from "@/utils/entitySteps";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    makeStyles,
    Paper,
} from "@material-ui/core";
import { TextField } from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

export default function SchoolInfoStep (props: EntityStepContent<School>) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const {
        required,
        alphanumeric,
        letternumeric,
        max,
    } = useValidations();
    const [ schoolName, setSchoolName ] = useState(value.school_name ?? ``);
    const [ shortCode, setShortCode ] = useState(value.shortcode ?? ``);

    useEffect(() => {
        const {
            school_name,
            shortcode,
        } = value;
        setSchoolName(school_name ?? ``);
        setShortCode(shortcode ?? ``);
    }, [ value ]);

    useEffect(() => {
        onChange?.({
            ...value,
            school_name: schoolName,
            shortcode: shortCode,
        });
    }, [ schoolName, shortCode ]);

    return (
        <>
            <Paper className={classes.paper}>
                <TextField
                    fullWidth
                    label={intl.formatMessage({
                        id: `schools_schoolNameLabel`,
                    })}
                    value={schoolName}
                    disabled={disabled}
                    hideHelperText={disabled}
                    autoFocus={!value.school_id}
                    validations={[
                        required(`The school name is required.`),
                        letternumeric(intl.formatMessage({
                            id: `schoolNameValidations_letternumeric`,
                        })),
                        max(120, intl.formatMessage({
                            id: `schools_maxCharValidation`,
                        }, {
                            value: 120,
                        })),
                    ]}
                    onChange={setSchoolName}
                />
            </Paper>
            <Paper className={classes.paper}>
                <TextField
                    fullWidth
                    label={intl.formatMessage({
                        id: `schools_shortCodeLabel`,
                    })}
                    value={shortCode}
                    disabled={disabled}
                    hideHelperText={disabled}
                    validations={[ alphanumeric(), max(10) ]}
                    onChange={setShortCode}
                />
            </Paper>
        </>
    );
}
