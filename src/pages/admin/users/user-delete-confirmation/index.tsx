import { Box, Typography } from "@mui/material"
import Checkbox from '@mui/material/Checkbox';
import { FormattedMessage } from "react-intl";
import KidsloopLogo from "@/assets/img/kidsloop.svg";
import FormControlLabel from '@mui/material/FormControlLabel';
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { useIntl } from "react-intl";
import { Button } from "@kl-engineering/kidsloop-px"
import { Theme } from "@mui/material";
import { useState } from "react";
import { tabTitle } from "@/utils/tabTitle";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        margin: "auto",
        width: "100%",
        maxWidth: 600,
        padding: theme.spacing(3, 3, 0, 3),
    },
    kidsloopLogo: {
        height: "3rem",
        margin: "auto",
    },
    title: {
        padding: theme.spacing(3, 0),
        textAlign: `center`,
        [theme.breakpoints.down(`sm`)]: {
            textAlign: `unset`,
        },
    },
    checkBox: {
        padding: theme.spacing(2),
        [theme.breakpoints.down(`sm`)]: {
            padding: theme.spacing(3, 0)
        },
    },
    buttons: {
        padding: theme.spacing(3, 0),
        display: "flex",
        justifyContent: "space-between",
    },
    cancelButton: {
        color: theme.palette.common.white,
        borderColor: theme.palette.common.white,
        margin: theme.spacing(0, 4),
    },
    confirmButton: {
        margin: theme.spacing(0, 4),
    },
}));
const content = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, placeat! Dolor quisquam amet unde, sit dolorem similique eius consequatur eum reiciendis reprehenderit, assumenda non recusandae corporis necessitatibus quibusdam eligendi distinctio.
Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, placeat! Dolor quisquam amet unde, sit dolorem similique eius consequatur eum reiciendis reprehenderit, assumenda non recusandae corporis necessitatibus quibusdam eligendi distinctio.
Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, placeat! Dolor quisquam amet unde, sit dolorem similique eius consequatur eum reiciendis reprehenderit, assumenda non recusandae corporis necessitatibus quibusdam eligendi distinctio.`;

export default function UserDeleteConfirmationPage() {
    const classes = useStyles();
    const intl = useIntl();
    const [policy, setPolicy] = useState(true);
    const [confirmation, setConfirmation] = useState(true);
    const handlepolicy = () => setPolicy(!policy);
    const handleconfirmation = () => setConfirmation(!confirmation);
    const redirectUser = (result: `success` | `cancel` | `error`) => {
        window.location.href = `kidsloopstudent://account-deletion?result=${result}`;
    };
    
    tabTitle(`User Delete Confirmation`);

    return (
        <Box className={classes.root} >
            <img src={KidsloopLogo} className={classes.kidsloopLogo} />
            <Typography variant="h4" className={classes.title}>
                <FormattedMessage id="user.deletion.confirmation.title" defaultMessage="Company Policy on Account Deletion"></FormattedMessage>
            </Typography>
            <Typography component="p">
                <FormattedMessage id="user.deletion.confirmation.content" defaultMessage={content}></FormattedMessage>
            </Typography>
            <div className={classes.checkBox}>
                <FormControlLabel control={<Checkbox />}
                    label={intl.formatMessage({
                        id: `user.deletion.confirmation.policylabel`,
                        defaultMessage: `I fully read, understood and agreed with the Company Policy on Account Deletion`
                    })}
                    onChange={handleconfirmation}
                />
                <FormControlLabel control={<Checkbox />}
                    label={intl.formatMessage({
                        id: `user.deletion.confirmation.confirmlabel`,
                        defaultMessage: `Once I confirm that I want account to be deleted, this action cannot be undone`
                    })}
                    onChange={handlepolicy}
                />
            </div>
            <div className={classes.buttons}>
                <Button
                    label={intl.formatMessage({
                        id: `user.deletion.cancel`,
                        defaultMessage: `Cancel`
                    })}
                    color="error"
                    variant="contained"
                    className={classes.cancelButton}
                    onClick={() => redirectUser(`cancel`)}
                />
                <Button
                    label={intl.formatMessage({
                        id: `user.deletion.confirm`,
                        defaultMessage: `Confirm`
                    })}
                    variant="contained"
                    className={classes.confirmButton}
                    color="success"
                    disabled={policy || confirmation}
                    onClick={() => redirectUser(`success`)}
                />
            </div>
        </Box>
    );
}


