import {
    Category,
    NON_SPECIFIED,
} from '@/types/graphQL';
import { buildEmptyCategory } from "@/utils/categories";
import { TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { SvgIconComponent } from '@material-ui/icons';
import Autocomplete,
{
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
} from '@material-ui/lab/Autocomplete';
import {
    IconButton,
    utils,
} from "kidsloop-px";
import { isEqual } from 'lodash';
import React,
{
    createRef,
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

const sortByName = (a: Category, b: Category) => {
    if (a.name === NON_SPECIFIED) return -1;
    if (b.name === NON_SPECIFIED) return 1;
    return a.name?.localeCompare(b?.name ?? ``) ?? 0;
};

const getErrorText = (value: unknown, validations: ((input: unknown) => true | string)[] | undefined) => validations?.map((validation) => validation(value)).find((result) => result !== true) as string | undefined;

export interface MenuItemAction {
    icon: SvgIconComponent;
    disabled?: boolean;
    onClick?: (value: Category) => void;
}

interface Props {
    value: Category;
    items: Category[];
    className?: string;
    menuItemActions?: (item: Category) => MenuItemAction[];
    validations?: ((input: unknown) => true | string)[];
    onChange: (value: Category) => void;
}

export default function SubcategoryComboBox (props: Props) {
    const {
        value,
        items,
        className,
        menuItemActions,
        validations,
        onChange,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const [ value_, setValue ] = useState<Category>(value);
    const [ inputValue, setInputValue ] = useState(value.name ?? ``);
    const [ options, setOptions ] = useState(items);
    const [ error_, setError ] = useState(getErrorText(inputValue, validations));
    const ref = createRef();

    useEffect(() => {
        if (isEqual(value, value_)) return;
        setInputValue(value_.name ?? ``);
        setValue(value);
    }, [ value ]);

    useEffect(() => {
        setOptions(items);
    }, [ items ]);

    useEffect(() => {
        onChange(value_);
    }, [ value_ ]);

    useEffect(() => {
        setError(getErrorText(inputValue, validations));
    }, [ inputValue ]);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: Category, reason: AutocompleteChangeReason, details: AutocompleteChangeDetails<Category> | undefined) => {
        setInputValue(``);
        switch (reason) {
        case `blur`:
            break;
        case `clear`:
            setValue((value) => ({
                ...value,
                name: ``,
            }));
            break;
        case `create-option`:
            setValue(newValue);
            setOptions([ ...options, newValue ]);
            break;
        case `remove-option`:
            setValue((value) => ({
                ...value,
                name: ``,
            }));
            break;
        case `select-option`:
            setValue(newValue);
            break;
        }
    };

    const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        setInputValue(newInputValue);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== `Enter` || !inputValue.trim()) return;
        const newCategory = buildEmptyCategory({
            name: inputValue.trim(),
            subcategories: value_.subcategories,
        });
        setValue(newCategory);
        setOptions([ ...options, newCategory ]);
        ref?.current?.blur();
    };

    return (
        <Autocomplete
            autoComplete
            fullWidth
            filterSelectedOptions
            disabledItemsFocusable
            blurOnSelect
            clearOnBlur={true}
            value={value_}
            inputValue={inputValue}
            className={className}
            getOptionLabel={(option) => option?.name ?? `Unknown`}
            options={options.sort(sortByName)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    inputRef={ref}
                    error={!!error_}
                    helperText={error_ ?? ` `}
                    label={intl.formatMessage({
                        id: `subjects_categoryLabel`,
                    })}
                    variant="outlined"
                />
            )}
            renderOption={(category) => (
                <Grid
                    container
                    alignItems="center"
                >
                    <Grid
                        item
                        xs
                    >
                        <span>{category.name}</span>
                    </Grid>
                    {menuItemActions?.(category).map((action, i) => (
                        <Grid
                            key={`menu-item-${i}`}
                            item
                        >
                            <IconButton
                                className={classes.icon}
                                disabled={action.disabled}
                                icon={action.icon}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    action.onClick?.(category);
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyPress={handleKeyPress}
            // onClose={handleBlur}
            // onBlur={handleBlur}
        />
    );
}
