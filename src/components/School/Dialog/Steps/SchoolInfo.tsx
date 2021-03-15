import { TabContent } from "./shared";
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

const useStyles = makeStyles((theme) => createStyles({
    paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

export default function SchoolInfoStep (props: TabContent) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
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
                    label="School Name"
                    value={schoolName}
                    disabled={disabled}
                    hideHelperText={disabled}
                    autoFocus={!value.school_id}
                    validations={[
                        required(),
                        letternumeric(),
                        max(35, `Max length 35 of characters`),
                    ]}
                    onChange={setSchoolName}
                />
            </Paper>
            <Paper className={classes.paper}>
                <TextField
                    fullWidth
                    label="Short Code (optional)"
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
