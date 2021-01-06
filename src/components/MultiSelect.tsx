import React, {
    useState
} from "react";
import {
    Checkbox,
    createStyles,
    Divider,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    TextField
} from "@material-ui/core";

const useStyles = makeStyles((theme) => createStyles({
}));

interface Props<T> {
    label: string
    items: T[]
    value: string[]
    selectAllLabel?: string
    noDataLabel?: string
    itemValue?: (item: T) => string
    itemText?: (item: T) => string
    onChange?: (values: string[]) => void
}

export default function MultiSelect<T> (props: Props<T>) {
    const {
        label,
        items,
        value,
        selectAllLabel,
        noDataLabel,
        itemValue = (item) => String(item),
        itemText = (item) => String(item),
        onChange,
    } = props;
    const classes = useStyles();
    const [ value_, setValue ] = useState(value);

    const toggleSelectAll = () => {
        let value: string[] = [];
        if (value_.length !== items.length) {
            value = items.map(itemValue);
        }
        setValue(value);
        onChange?.(value);
    };

    return <>
        <TextField
            helperText=" "
            select
            fullWidth
            label={label}
            variant="outlined"
            SelectProps={{
                multiple: true,
                renderValue: value_.includes("") ? undefined : (value) => 
                    value_.map((v) => {
                        const item = items.find((item) => itemValue(item) === v);
                        if (!item) return "";
                        return itemText(item);
                    }).join(", "),
                value: value_,
                onChange: (e) => {
                    const values = e.target.value as string[];
                    if (values.includes("")) {
                        toggleSelectAll();
                        return;
                    }
                    setValue(values);
                    onChange?.(values);
                }
            }}
        >
            {items.length === 0
                ? <MenuItem disabled>
                    <ListItemText>
                        {noDataLabel ?? "No items"}
                    </ListItemText>
                </MenuItem>
                : [
                    <MenuItem
                        value=""
                        key="selectAll"
                    >
                        <ListItemIcon>
                            <Checkbox
                                checked={items.length > 0 && items.map(itemValue).every((v) => value_.includes(v))}
                                indeterminate={value_.length > 0 && value_.length < items.length}
                            />
                        </ListItemIcon>
                        <ListItemText>
                            {selectAllLabel ?? "Select All"}
                        </ListItemText>
                    </MenuItem>,
                    <Divider key="divider"/>,
                    ...items.map((item) =>
                        <MenuItem
                            key={itemValue(item)}
                            value={itemValue(item)}
                        >
                            <ListItemIcon>
                                <Checkbox checked={value_.includes(itemValue(item))} />
                            </ListItemIcon>
                            <ListItemText>
                                {itemText(item)}
                            </ListItemText>
                        </MenuItem>
                    ),
                ]}
        </TextField>
    </>;

}