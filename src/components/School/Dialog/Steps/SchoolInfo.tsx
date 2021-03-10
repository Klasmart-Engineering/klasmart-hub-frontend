import { TabContent } from "./shared";
import ProgramTable from "@/components/Program/Table";
import { Program } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    FormHelperText,
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
    const { required, alphanumeric } = useValidations();
    const [ schoolName, setSchoolName ] = useState(value.school_name ?? ``);
    const [ shortCode, setShortCode ] = useState(value.short_code ?? ``);

    const programData: Program[] = [
        {
            program_id: `1`,
            grades: [
                {
                    grade_id: `1`,
                    grade_name: `Grade 1`,
                },
            ],
            age_ranges: [
                {
                    age_range_id: `1`,
                    from: 0,
                    fromUnit: `year`,
                    to: 1,
                    toUnit: `year`,
                },
            ],
            program_name: `Hello`,
            subjects: [
                {
                    subject_id: `1`,
                    subject_name: `General`,
                    categories: [
                        {
                            id: `1`,
                            name: `Category 1`,
                            subcategories: [
                                {
                                    id: `1`,
                                    name: `Subcategory 1`,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    useEffect(() => {
        const {
            school_name,
            short_code,
        } = value;
        setSchoolName(school_name ?? ``);
        setShortCode(short_code ?? ``);
    }, [ value ]);

    useEffect(() => {
        onChange?.({
            ...value,
            school_name: schoolName,
            short_code: shortCode,
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
                    validations={[ required(), alphanumeric() ]}
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
                    validations={[ alphanumeric() ]}
                    onChange={setShortCode}
                />
            </Paper>
        </>
    );
}
