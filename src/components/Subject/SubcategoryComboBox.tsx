import {
    NON_SPECIFIED,
    Subcategory,
} from '@/types/graphQL';
import { buildNewSubcategory } from "@/utils/subcategories";
import { SvgIconComponent } from "@mui/icons-material";
import { TextField } from '@mui/material';
import Autocomplete,
{
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
} from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton } from 'kidsloop-px';
import { isEqual } from 'lodash';
import React,
{
    useEffect,
    useState,
} from 'react';
import { useIntl } from 'react-intl';

const useStyles = makeStyles((theme) => ({
    icon: {
        height: 32,
        width: 32,
    },
    deleting: {
        backgroundColor: theme.palette.error.light,
    },
}));

const INPUT_DIVIDERS = [ `,`, `;` ];

const sortByName = (a: Subcategory, b: Subcategory) => {
    if (a.name === NON_SPECIFIED) return -1;
    if (b.name === NON_SPECIFIED) return 1;
    return a.name?.localeCompare(b?.name ?? ``) ?? 0;
};

const getErrorText = (value: unknown, validations: ((input: unknown) => true | string)[] | undefined) => validations?.map((validation) => validation(value)).find((result) => result !== true) as string | undefined;

export interface MenuItemAction {
    icon: SvgIconComponent;
    disabled?: boolean;
    onClick?: (value: Subcategory) => void;
}

interface Props {
    value: Subcategory[];
    items: Subcategory[];
    disabled?: boolean;
    className?: string;
    menuItemActions?: (item: Subcategory) => MenuItemAction[];
    validations?: ((input: unknown) => true | string)[];
    onChange: (value: Subcategory[]) => void;
}

export default function SubsubcategoryComboBox (props: Props) {
    const {
        value,
        items,
        disabled,
        className,
        menuItemActions,
        validations,
        onChange,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const [ value_, setValue ] = useState(value);
    const [ inputValue, setInputValue ] = useState(``);
    const [ options, setOptions ] = useState(items);
    const [ error_, setError ] = useState(getErrorText(value_, validations));

    useEffect(() => {
        if (isEqual(value.slice().sort(sortByName), value_.slice().sort(sortByName))) return;
        setValue(value);
    }, [ value ]);

    useEffect(() => {
        setOptions(items);
    }, [ items ]);

    useEffect(() => {
        onChange(value_);
    }, [ value_ ]);

    useEffect(() => {
        const error = getErrorText(value_, validations);
        setError(error);
    }, [ value_ ]);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: Subcategory[], reason: AutocompleteChangeReason, details: AutocompleteChangeDetails<Subcategory> | undefined) => {
        switch (reason) {
        case `blur`:
            break;
        case `clear`:
            setValue([]);
            break;
        case `create-option`:
            break;
        case `remove-option`:
            if (!details?.option) break;
            setValue((value) => value.filter((subcategory) => subcategory.id !== details.option.id));
            break;
        case `select-option`:
            if (!details?.option) break;
            setValue((value) => [ ...value, details.option ]);
            break;
        }
    };

    const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        setInputValue(newInputValue);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const filteredInputValue = inputValue.trim().split(``).filter((char) => !INPUT_DIVIDERS.includes(char)).join(``);
        if (![ ...INPUT_DIVIDERS, `Enter` ].includes(event.key) || !filteredInputValue) return;
        const newSubcategory = buildNewSubcategory({
            name: filteredInputValue,
        });
        setValue([ ...value_, newSubcategory ]);
        setOptions([ ...options, newSubcategory ]);
        setInputValue(``);
    };

    return (
        <Autocomplete
            autoHighlight
            autoComplete
            fullWidth
            multiple
            includeInputInList
            filterSelectedOptions
            disabledItemsFocusable
            disableCloseOnSelect
            className={className}
            disabled={disabled}
            getOptionLabel={(option) => option?.name ?? `Unknown`}
            options={options}
            value={value_}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    error={!!error_}
                    helperText={error_ ?? ` `}
                    label={intl.formatMessage({
                        id: `subjects_subcategories`,
                    })}
                    variant="outlined"
                />
            )}
            renderOption={(subcategory) => (
                <Grid
                    container
                    alignItems="center"
                >
                    <Grid
                        item
                        xs
                    >
                        <span>{subcategory.name}</span>
                    </Grid>
                    {menuItemActions?.(subcategory).map((action, i) => (
                        <Grid
                            key={`menu-item-${i}`}
                            item
                        >
                            <IconButton
                                className={classes.icon}
                                disabled={action.disabled}
                                icon={action.icon}
                                size="medium"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    action.onClick?.(subcategory);
                                }} />
                        </Grid>
                    ))}
                </Grid>
            )}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyPress={handleKeyPress}
        />
    );
}
