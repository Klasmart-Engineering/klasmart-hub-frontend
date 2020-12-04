import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Snackbar,
    TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import PropTypes from "prop-types";
import React, { useState } from "react";

SimpleDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    selectedValue: PropTypes.string,
};

/**
 * Returns function to show a dialog with form for "Age range" field
 */
function SimpleDialog(props: any) {
    const { onClose, selectedValue, ...other } = props;
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    const [fromRadio, setValueFrom] = useState("months");
    const [toRadio, setValueTo] = useState("months");
    const [open, setOpen] = useState(false);

    const handleChangeRadioFrom = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setValueFrom((event.target as HTMLInputElement).value);
    };

    const handleChangeRadioTo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueTo((event.target as HTMLInputElement).value);
    };

    const handleChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMinValue(Number(event.target.value));
    };

    const handleChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxValue(Number(event.target.value));
    };

    const handleClose = () => {
        onClose([
            { type: "months", value: 0 },
            { type: "ages", value: 0 },
        ]);
    };

    const validateAgeRange = () => {
        if (fromRadio === toRadio && minValue === maxValue) {
            return false;
        }

        if (fromRadio === "ages" && toRadio === "months") {
            return false;
        }

        if (fromRadio === toRadio) {
            if (minValue > maxValue) {
                return false;
            }
        }

        return true;
    };

    const handleAcceptClick = () => {
        if (validateAgeRange()) {
            onClose([
                { type: fromRadio, value: minValue },
                { type: toRadio, value: maxValue },
            ]);
        } else {
            setOpen(true);
        }
    };

    const handleCloseAlert = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                onClose={handleClose}
                aria-labelledby="simple-dialog-title"
                {...other}
                fullWidth={true}
                maxWidth={"sm"}
            >
                <DialogTitle>Age range</DialogTitle>
                <DialogContent dividers>
                    <form noValidate>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <RadioGroup
                                    aria-label="gender"
                                    name="gender1"
                                    value={fromRadio}
                                    onChange={handleChangeRadioFrom}
                                >
                                    <FormControlLabel
                                        value="months"
                                        control={<Radio />}
                                        label="Months"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="ages"
                                        control={<Radio />}
                                        label="Ages"
                                        labelPlacement="top"
                                    />
                                </RadioGroup>

                                <TextField
                                    id="txtFrom"
                                    inputProps={{ min: "0", max: "99", step: "" }}
                                    label={fromRadio}
                                    type="number"
                                    value={minValue}
                                    fullWidth
                                    onChange={handleChangeMin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                            <div>
                                <p>To</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <RadioGroup
                                    aria-label="gender"
                                    name="gender1"
                                    value={toRadio}
                                    onChange={handleChangeRadioTo}
                                >
                                    <FormControlLabel
                                        value="months"
                                        control={<Radio />}
                                        label="Months"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="ages"
                                        control={<Radio />}
                                        label="Ages"
                                        labelPlacement="top"
                                    />
                                </RadioGroup>

                                <FormControl fullWidth>
                                    <TextField
                                        id="txtTo"
                                        inputProps={{ min: "0", max: "99", step: "1" }}
                                        label={toRadio}
                                        type="number"
                                        value={maxValue}
                                        fullWidth
                                        onChange={handleChangeMax}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAcceptClick} color="primary">
            Ok
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={open} autoHideDuration={4000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="warning">
          Invalid age range
                </Alert>
            </Snackbar>
        </>
    );
}

SimpleDialog.propTypes = {
    onChange: PropTypes.func,
};

/**
 * Returns function to show a dialog for "Age range" field
 */
export default function DialogAgeRange(props: any) {
    const { value, onChange } = props;
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(
        value || [
            { type: "months", value: "0" },
            { type: "ages", value: "0" },
        ],
    );

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: any) => {
        setOpen(false);
        setSelectedValue(value);
        onChange(value);
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>
                {selectedValue[0].value} {selectedValue[0].type} -{" "}
                {selectedValue[1].value} {selectedValue[1].type}
            </Button>

            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}
