import { TabContent } from "./shared";
import {
    AgeRange,
    Grade,
} from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    Select,
    TextField,
} from "kidsloop-px";
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

export default function ProgramInfoStep (props: TabContent) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
    const { required, alphanumeric } = useValidations();
    const [ programName, setProgramName ] = useState(value.program_name ?? ``);
    const [ grades, setGrades ] = useState<Grade[]>(value.grades ?? []);
    const [ ageRanges, setAgeRanges ] = useState<AgeRange[]>(value.age_ranges ?? []);
    const gradesData: Grade[] = [];
    const ageRangesData: AgeRange[] = [];

    useEffect(() => {
        const {
            program_name,
            grades,
            age_ranges,
        } = value;
        setProgramName(program_name ?? ``);
        setGrades(grades ?? []);
        setAgeRanges(age_ranges ?? []);
    }, [ value ]);

    useEffect(() => {
        onChange?.({
            ...value,
            program_name: programName,
            grades: grades,
            age_ranges: ageRanges,
        });
    }, [ programName, grades ]);

    return (
        <>
            <Paper className={classes.paper}>
                <TextField
                    fullWidth
                    label="Program Name"
                    value={programName}
                    disabled={disabled}
                    hideHelperText={disabled}
                    autoFocus={!value.program_id}
                    validations={[ required(), alphanumeric() ]}
                    onChange={setProgramName}
                />
            </Paper>
            <Paper className={classes.paper}>
                <Select
                    multiple
                    fullWidth
                    label="Grades"
                    value={grades}
                    items={gradesData}
                    disabled={disabled}
                    hideHelperText={disabled}
                    validations={[ required() ]}
                    onChange={setGrades}
                />
            </Paper>
            <Paper className={classes.paper}>
                <Select
                    multiple
                    fullWidth
                    label="Age Ranges"
                    value={ageRanges}
                    items={ageRangesData}
                    disabled={disabled}
                    hideHelperText={disabled}
                    validations={[ required() ]}
                    onChange={setAgeRanges}
                />
            </Paper>
        </>
    );
}
