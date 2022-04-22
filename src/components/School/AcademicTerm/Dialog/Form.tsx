import { ACADEMIC_TERM_NAME_LENGTH_MAX } from "@/config/index";
import { useValidations } from "@/utils/validations";
import { TextField as PxTextField } from "@kl-engineering/kidsloop-px";
import { TextField, Theme } from "@mui/material";
import Stack from '@mui/material/Stack';
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from "moment";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { AcademicTermRow } from "../Table";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                marginBottom: theme.spacing(2),
            },
        },
    }));

export interface AcademicTermForm {
    name: string;
    startDate: string;
    endDate: string;
}

interface DateValidation {
    error: boolean,
    message?: string
}

interface Props {
    value: AcademicTermForm;
    onChange: (value: AcademicTermForm) => void;
    onValidation: (valid: boolean) => void;
    loading?: boolean;
    data: AcademicTermRow[];
}

export default function AcademicTermDialogForm (props: Props) {
    const {
        value,
        onChange,
        onValidation: setIsFormValid,
        loading,
        data
    } = props;

    const classes = useStyles();
    const intl = useIntl();

    const {
        required,
        letternumeric,
        max,
    } = useValidations();
    
    const [ name, setName ] = useState(``);
    const [ startDateValue, setStartDateValue ] = useState<string>(value.startDate ??  ``);
    const [ endDateValue, setEndDateValue ] = useState<string>(value.endDate ?? ``);

    const [ isNameValid, setIsNameValid] = useState(false);
    const [ startDateValidation, setStartDateValidation ] = useState<DateValidation>({ error: false });
    const [ endDateValidation, setEndDateValidation ] = useState<DateValidation>({ error: false });

    const academicTermDateRanges: {startDate: string, endDate: string}[] = data?.map((academicTerm)=> { 
        return { startDate: academicTerm.startDate, endDate: academicTerm.endDate }
    })

    const resetDateErrors = () => {
        setStartDateValidation({ error: false, message: undefined })
        setEndDateValidation({ error: false, message: undefined })
    }

    const validateStartDate = () => {
        if (!startDateValue) { 
            setStartDateValidation({
                error: true,
                message: intl.formatMessage({ id: `academicTerm.todo`, defaultMessage: `Required` }) 
            });
        } else if (startDateValue === endDateValue) {
            setStartDateValidation({
                error: true, 
                message: intl.formatMessage({ id: `academicTerm.todo`, defaultMessage: `The Start and End Dates cannot be the same date` })
            });
        } else if (endDateValue && startDateValue > endDateValue){
            setStartDateValidation({ 
                error:true, 
                message: intl.formatMessage({ id: `academicTerm.todo`, defaultMessage: `Start Date should be prior to End Date` })
            });
        }
    }

    const validateEndDate = () => {
        if (!endDateValue) { 
            setEndDateValidation({
                error: true, 
                message: intl.formatMessage({ id: `academicTerm.todo`,  defaultMessage: `Required` }) 
            }); 
        } else if (startDateValue === endDateValue) {
            setEndDateValidation({
                error:true, 
                message: intl.formatMessage({ id: `academicTerm.todo`, defaultMessage: `The Start and End Dates cannot be the same date` })
            });
        } else if (startDateValue && startDateValue > endDateValue){
            setEndDateValidation({ 
                error:true, 
                message: intl.formatMessage({ id: `academicTerm.todo`, defaultMessage: `Start Date should be prior to End Date` })
            });
        }
    }

    const validateDateRanges = () => {
        academicTermDateRanges.forEach((dateRange)=>{
            const dateRangeStart = moment(dateRange.startDate)
            const dateRangeEnd = moment(dateRange.endDate)
            const startDate = moment(startDateValue)
            const endDate = moment(endDateValue)
            
            const isInvalidDateRange = startDate.isBetween(dateRangeStart, dateRangeEnd, undefined, '[]') || dateRangeStart.isBetween(startDate, endDate, undefined, '[]') || 
            endDate.isBetween(dateRangeStart, dateRangeEnd, undefined, '[]') || dateRangeEnd.isBetween(startDate, endDate, undefined, '[]');

            if(isInvalidDateRange) {
                setStartDateValidation({ 
                    error:true, 
                    message: intl.formatMessage({ id: `academicTerm.todo`, defaultMessage: `This date range conflicts with an existing academic term range` })
                });
                setEndDateValidation({ 
                    error:true, 
                    message: intl.formatMessage({ id: `academicTerm.todo`, defaultMessage: `This date range conflicts with an existing academic term range` })
                });
            }
        })
    }

    const validateDates = () => {
        validateStartDate();
        validateEndDate();
        validateDateRanges();
    }

    useEffect(() => {
        resetDateErrors();
        validateDates();
    }, [ startDateValue, endDateValue ])

    useEffect(() => {
        if(!isNameValid || startDateValidation.error || endDateValidation.error) { setIsFormValid(false); return; }
        
        setIsFormValid(true)

        const academicTermForm : AcademicTermForm = {
            name,
            startDate: startDateValue,
            endDate: endDateValue
        }

        onChange(academicTermForm);

    }, [ isNameValid, startDateValidation, startDateValidation ])

    

    return (
        <div className={classes.root}>
            <PxTextField
                fullWidth
                id="class-dialog-name"
                value={name}
                label={intl.formatMessage({
                    id: `academicTerm.todo`,
                    defaultMessage: `Name`
                })}
                variant="outlined"
                type="text"
                validations={[
                    required(intl.formatMessage({
                        id: `academicTerm.todo`,
                        defaultMessage: `The academic term name is required`
                    })),
                    letternumeric(intl.formatMessage({
                        id: `academicTerm.todo`,
                        defaultMessage: `The academic term can only contain letters, numbers, space and & / , -.`
                    })),
                    max(ACADEMIC_TERM_NAME_LENGTH_MAX, intl.formatMessage({
                        // ie `validation.error.class.name.maxLength`
                        id: `academicTerm.todo`,
                        defaultMessage: `The academic term name has a max length of {value} characters`
                    }, {
                        value: ACADEMIC_TERM_NAME_LENGTH_MAX,
                    })),
                ]}
                loading={loading}
                disabled={loading}
                onChange={(value) => setName(value)}
                onValidate={setIsNameValid}
            />

            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Stack spacing={3}>
                    <DatePicker
                        disablePast
                        label={intl.formatMessage({
                            id: `academicTerm.todo`,
                            defaultMessage: `Start date`,
                        })}
                        openTo="day"
                        views={[
                            `year`,
                            `month`,
                            `day`,
                        ]}
                        value={startDateValue}
                        renderInput={(params) => 
                            <TextField {...params} 
                                required 
                                error={ startDateValidation.error } 
                                helperText={ startDateValidation.error ? startDateValidation?.message : undefined}
                            />
                        }
                        onChange={(newValue) => {
                            const isoDateString = moment(newValue).startOf('hour').toISOString();
                            setStartDateValue(isoDateString);
                        }}
                    />
                    <DatePicker
                        disablePast
                        label={intl.formatMessage({
                            id: `academicTerm.todo`,
                            defaultMessage: `End date`,
                        })}
                        openTo="day"
                        views={[
                            `year`,
                            `month`,
                            `day`,
                        ]}
                        value={endDateValue}
                        renderInput={(params) => 
                            <TextField {...params} 
                                required 
                                error={ endDateValidation.error } 
                                helperText={ endDateValidation.error ? endDateValidation?.message : undefined}
                            />
                        }
                        onChange={(newValue) => {
                            const isoDateString = moment(newValue).startOf('hour').toISOString();
                            setEndDateValue(isoDateString);
                        }}
                    />
                </Stack>
            </LocalizationProvider>
        </div>
    );
}
