import { SchoolStepper } from "./shared";
import { EntityStepContent } from "@/utils/entitySteps";
import { useValidations } from "@/utils/validations";
import { Paper } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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

export default function SchoolInfoStep (props: EntityStepContent<SchoolStepper>) {
    const {
        value,
        disabled,
        onChange,
        loading,
        isEdit,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const {
        required,
        alphanumeric,
        letternumeric,
        max,
    } = useValidations();
    const [ schoolName, setSchoolName ] = useState(value.name ?? ``);
    const [ shortCode, setShortCode ] = useState(value.shortcode ?? ``);

    useEffect(() => {
        const {
            name,
            shortcode,
        } = value;
        setSchoolName(name ?? ``);
        setShortCode(shortcode ?? ``);
    }, [ value ]);

    useEffect(() => {
        onChange?.({
            ...value,
            name: schoolName,
            shortcode: shortCode,
        });
    }, [ schoolName, shortCode ]);

    return (
        <>
            <Paper className={classes.paper}>
                <TextField
                    fullWidth
                    id={`schoolName`}
                    label={intl.formatMessage({
                        id: `schools_schoolNameLabel`,
                    })}
                    value={schoolName}
                    disabled={disabled}
                    hideHelperText={disabled}
                    autoFocus={!value.id}
                    validations={(isEdit && value.id && !loading) || !isEdit ? [
                        required(`The school name is required.`),
                        letternumeric(intl.formatMessage({
                            id: `schoolNameValidations_letternumeric`,
                        })),
                        max(120, intl.formatMessage({
                            id: `schools_maxCharValidation`,
                        }, {
                            value: 120,
                        })),
                    ] : []}
                    onChange={setSchoolName}
                />
            </Paper>
            <Paper className={classes.paper}>
                <TextField
                    fullWidth
                    id={`shortCode`}
                    label={intl.formatMessage({
                        id: `common.inputField.optional`,
                    }, {
                        inputField: intl.formatMessage({
                            id: `schools_shortCodeLabel`,
                        }),
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
